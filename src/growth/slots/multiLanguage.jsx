import LangBar from "../lang/LangBar";
// Importing langStore installs the axios `x-lang` request interceptor.
export { formatDisplayPrice } from "../lang/langStore";

/** Multi-language & currency add-on: language + display-currency selector bar at the very top of every page. */
export const slots = {
  "layout.top": { module: "multiLanguage", Component: LangBar },
};
export const profileTabs = [];
