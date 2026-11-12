import BlogIndex from "../seo/BlogIndex.jsx";
import BlogPost from "../seo/BlogPost.jsx";
import CmsPage from "../seo/CmsPage.jsx";
import ProductSeo from "../seo/ProductSeo.jsx";
import CategorySeo from "../seo/CategorySeo.jsx";
import LayoutTop from "../seo/LayoutTop.jsx";

/** SEO & content add-on: /blog, /blog/:slug, /page/:slug, product + home SEO overrides, client-side redirects. */
export const pages = { "seoCms:blog": BlogIndex, "seoCms:post": BlogPost, "seoCms:page": CmsPage };
export const slots = {
  "productPage.seo": { module: "seoCms", Component: ProductSeo },
  "categoryPage.seo": { module: "seoCms", Component: CategorySeo },
  "layout.top": { module: "seoCms", Component: LayoutTop },
};
export const profileTabs = [];
