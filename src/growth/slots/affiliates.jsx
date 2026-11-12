import AffiliateCapture from "../affiliates/AffiliateCapture";
import Dashboard from "../affiliates/Dashboard";

/** Affiliate program storefront extension points (rendered only when the `affiliates` module is ON for the store). */
export const slots = {
  "layout.top": { module: "affiliates", Component: AffiliateCapture },
};

export const pages = {
  "affiliates:dashboard": Dashboard,
};
