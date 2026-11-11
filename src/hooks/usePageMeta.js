import { useEffect } from 'react';

const upsert = (selector, create, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

const setMeta = (attr, key, content) => {
  if (!content) return;
  upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  }, { content });
};

const absolute = (url) => {
  if (!url) return url;
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
};

/**
 * Lightweight SEO helper (no dependency): sets document.title, meta description, canonical,
 * Open Graph / Twitter tags and optional JSON-LD for the current page.
 * Note: the app is a client-rendered SPA, so crawlers that do not execute JS only see the
 * defaults in index.html. Prerendering / SSR is the follow-up for full coverage.
 */
export default function usePageMeta({ title, description, canonical, image, jsonLd, noindex } = {}) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (image) {
      setMeta('property', 'og:image', absolute(image));
      setMeta('name', 'twitter:image', absolute(image));
    }

    const canonicalHref = absolute(canonical || window.location.pathname);
    upsert('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }, { href: canonicalHref });
    setMeta('property', 'og:url', canonicalHref);

    if (noindex) setMeta('name', 'robots', 'noindex, nofollow');

    let script;
    if (jsonLdString) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-meta', 'true');
      script.text = jsonLdString;
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      if (script) script.remove();
      if (noindex) setMeta('name', 'robots', 'index, follow');
    };
  }, [title, description, canonical, image, jsonLdString, noindex]);
}
