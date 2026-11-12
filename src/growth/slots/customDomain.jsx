import Branding from "../customDomain/Branding.jsx";

/** Custom domain & white-label add-on: applies the store's brand name (title suffix), favicon and optional credit hiding. No pages, no tabs. */
export const slots = { "layout.top": { module: "customDomain", Component: Branding } };
export const profileTabs = [];
