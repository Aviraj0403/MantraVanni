import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import * as engine from "./engine";
import { registerMarketingEngine } from "./api";
import ConsentBanner from "./ConsentBanner.jsx";
import { captureAttribution } from "./attribution";

export default function MarketingRoot({ pixelId, consentRequired }) {
  const { pathname } = useLocation();
  useSyncExternalStore(engine.subscribe, engine.getSnapshot);
  const st = engine.getState();
  const lastKey = useRef("");

  useEffect(() => {
    try {
      engine.initEngine({ pixelId, consentRequired });
      registerMarketingEngine(engine);
    } catch { /* ignore */ }
    const open = () => engine.openBanner();
    window.addEventListener("mv:consent-open", open);
    return () => {
      window.removeEventListener("mv:consent-open", open);
      registerMarketingEngine(null);
    };
  }, [pixelId, consentRequired]);

  const allowed = engine.isAllowed();
  useEffect(() => {
    try {
      captureAttribution();
      if (!allowed) return;
      const key = `${pathname}|${allowed}`;
      if (lastKey.current === key) return;
      lastKey.current = key;
      engine.track("PageView");
    } catch { /* ignore */ }
  }, [pathname, allowed]);

  if (!st.bannerOpen) return null;
  return (
    <ConsentBanner
      current={st.consent}
      onAccept={() => engine.setConsent("accept")}
      onDecline={() => engine.setConsent("decline")}
      onDismiss={engine.dismissBanner}
    />
  );
}
