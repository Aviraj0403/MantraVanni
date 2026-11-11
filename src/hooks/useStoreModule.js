import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "../services/settingsApi";

/**
 * Is a store module (public settings `modules[key]`) available for this store?
 * A module the superadmin/plan switched off, the store owner switched off, or that was retired must not be called or shown:
 * its API answers 403 ("module is deactivated"). `ready` is false until the settings are known, so callers never fire a
 * request for a module before they know it is enabled.
 */
export default function useStoreModule(key) {
  const { data, isLoading } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
  const known = !isLoading && !!data?.modules;
  return { ready: known, enabled: known && data.modules[key] !== false };
}
