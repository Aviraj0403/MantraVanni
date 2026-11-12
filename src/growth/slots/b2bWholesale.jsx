import { Building2 } from "lucide-react";
import TierBox from "../b2b/TierBox";
import ApplyPage from "../b2b/ApplyPage";
import WholesaleTab from "../b2b/WholesaleTab";

/** B2B / wholesale storefront extension points (rendered only when the `b2bWholesale` module is ON for the store). */
export const slots = {
  "productPage.afterActions": { module: "b2bWholesale", Component: TierBox },
};

export const profileTabs = [
  { module: "b2bWholesale", key: "wholesale", label: "Wholesale", short: "Wholesale", icon: Building2, Component: WholesaleTab },
];

export const pages = {
  "b2bWholesale:apply": ApplyPage,
};
