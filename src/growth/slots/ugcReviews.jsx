import React from "react";
import Gallery from "../ugc/Gallery";
import Questions from "../ugc/Questions";

/** productPage.beforeReviews: customer photo / video gallery + product Q&A. Both render nothing when empty or failing. */
function UgcBlock({ product }) {
  const id = product?._id || product?.id;
  if (!id) return null;
  return (
    <>
      <Gallery productId={id} />
      <Questions productId={id} />
    </>
  );
}

export const slots = { "productPage.beforeReviews": { module: "ugcReviews", Component: UgcBlock } };
export const profileTabs = [];
