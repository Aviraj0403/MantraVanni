import { Repeat } from "lucide-react";
import SubscribeBox from "../subscriptions/SubscribeBox";
import MySubscriptions from "../subscriptions/MySubscriptions";

export const slots = {
  "productPage.afterActions": { module: "subscriptions", Component: SubscribeBox },
};

export const profileTabs = [
  { module: "subscriptions", key: "subscriptions", label: "Subscriptions", short: "Subscribe", icon: Repeat, Component: MySubscriptions },
];
