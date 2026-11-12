import React from "react";
import { useGrowthFlags } from "./flags";
import NotFoundPage from "../pages/PNF/NotFoundPage.jsx";

/**
 * Customer-facing PAGES that belong to a growth add-on (blog, booking, affiliate dashboard...).
 * A slot file (src/growth/slots/<module>.jsx) exports
 *   export const pages = { "seoCms:blog": BlogIndex, "seoCms:post": BlogPost, ... };
 * and router.jsx mounts fixed routes that render <GrowthRoute module="seoCms" view="blog" />.
 * The page renders only when the add-on's flag is ON for the store; otherwise the normal 404 page.
 * Route params are available through react-router's useParams() inside your component.
 */
const files = import.meta.glob("./slots/*.jsx", { eager: true });
const pageMap = {};
Object.values(files).forEach((m) => Object.entries(m.pages || {}).forEach(([k, C]) => { pageMap[k] = C; }));

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.error("[growth page]", e?.message); }
  render() { return this.state.failed ? <NotFoundPage /> : this.props.children; }
}

export default function GrowthRoute({ module, view }) {
  const flags = useGrowthFlags();
  const C = pageMap[module + ":" + view];
  if (!C) return <NotFoundPage />;
  if (flags[module] === undefined && Object.keys(flags).length === 0) {
    return <div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;
  }
  if (!flags[module]) return <NotFoundPage />;
  return <Boundary><C /></Boundary>;
}
