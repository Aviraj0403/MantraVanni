import { Ticket } from "lucide-react";
import GiftCardsTab from "../giftCards/GiftCardsTab";

/** Gift cards & store credit: a "My account" tab only (rendered when the `giftCards` module is ON for the store). */
export const slots = {};

export const profileTabs = [
  { module: "giftCards", key: "giftcards", label: "Gift cards", short: "Gift cards", icon: Ticket, Component: GiftCardsTab },
];
