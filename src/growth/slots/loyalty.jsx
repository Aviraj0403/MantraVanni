import { Gift } from "lucide-react";
import RewardsTab from "../loyalty/RewardsTab";
import EarnLine from "../loyalty/EarnLine";

/** Loyalty & referrals storefront extension points (rendered only when the `loyalty` module is ON for the store). */
export const slots = {
  "productPage.afterActions": { module: "loyalty", Component: EarnLine },
};

export const profileTabs = [
  { module: "loyalty", key: "rewards", label: "Rewards", short: "Rewards", icon: Gift, Component: RewardsTab },
];
