import React, { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "../services/settingsApi";

const MarketingRoot = lazy(() => import("./MarketingRoot.jsx"));

/** Mounted once in the layout. Renders nothing (and loads no marketing code) unless public settings enable it. */
export default function MarketingProvider() {
  const { data } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
  const m = data?.marketing;
  if (!m || m.enabled !== true || !m.pixelId) return null;
  return (
    <Suspense fallback={null}>
      <MarketingRoot pixelId={m.pixelId} consentRequired={!!m.consentRequired} />
    </Suspense>
  );
}
