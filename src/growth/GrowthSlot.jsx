import React from "react";
import { useGrowthFlags } from "./flags";

/**
 * Extension points for the optional growth add-ons (loyalty, upsell, subscriptions, ...).
 *
 * Each add-on adds ONE file  src/growth/slots/<module>.jsx  that may export:
 *   export const slots = { "cart.beforeSummary": { module: "upsell", Component: MyComp }, ... };
 *   export const profileTabs = [{ module: "loyalty", key: "rewards", label: "Rewards", short: "Rewards", icon: Gift, Component: RewardsTab }];
 * Files are discovered with import.meta.glob, so nothing else needs editing. A slot only renders when the add-on's flag is ON
 * for the store (GET /growth/flags), and a crash inside an add-on can never take the page down (error boundary per component).
 *
 * Slot names placed in the pages today:
 *   productPage.afterActions   props { product, variant, soldOut }      (under Add to Cart / Buy Now)
 *   productPage.beforeReviews  props { product }                        (above the reviews section)
 *   cart.beforeSummary         props { cartItems, totalAmount }         (above the Order Summary card)
 *   layout.top                 props {}                                 (very top of every page, above the header: festival strips, announcements)
 *   layout.beforeFooter        props {}                                 (above the footer on every page)
 *   productPage.seo            props { product, variant }               (render null; may call usePageMeta to override title/description/og:image)
 *   categoryPage.seo           props { categorySlug }                   (render null; same idea for category pages)
 * Whole pages (blog, booking, ...) are registered with `export const pages = {...}`; see GrowthRoute.jsx.
 */
const files = import.meta.glob("./slots/*.jsx", { eager: true });
const slotMap = {};
const tabList = [];
Object.values(files).forEach((m) => {
  Object.entries(m.slots || {}).forEach(([name, def]) => { (slotMap[name] ||= []).push(def); });
  (m.profileTabs || []).forEach((t) => tabList.push(t));
});

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.error("[growth slot]", e?.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function GrowthSlot({ name, ...props }) {
  const flags = useGrowthFlags();
  const defs = slotMap[name];
  if (!defs || !defs.length) return null;
  return defs.filter((d) => flags[d.module]).map((d, i) => {
    const C = d.Component;
    return <Boundary key={d.module + ":" + i}><C {...props} /></Boundary>;
  });
}

/** Extra "My account" tabs from the add-ons that are on. */
export const useProfileTabs = () => {
  const flags = useGrowthFlags();
  return tabList.filter((t) => flags[t.module]);
};
