import { useQuery } from "@tanstack/react-query";
import { getPublicSettings } from "../services/settingsApi";

// Combos & bundles is an opt-in module (settings.modules.combos).
// Shares the ["publicSettings"] query with the header/footer.
export function useCombosModule() {
  const { data, isLoading } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
  return { enabled: data?.modules?.combos === true, isLoading };
}

// false while loading/unknown
export default function useCombosEnabled() {
  return useCombosModule().enabled;
}

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
