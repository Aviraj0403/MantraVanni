import React from "react";
import CartProgress from "../upsell/CartProgress";
import RecoList from "../upsell/RecoList";

function CartSlot({ cartItems, totalAmount }) {
  const ids = (cartItems || []).map((i) => i?.id).filter(Boolean).map(String);
  return (
    <>
      <CartProgress totalAmount={totalAmount} />
      {ids.length > 0 && <RecoList productIds={ids} source="cart" layout="strip" />}
    </>
  );
}

function ProductSlot({ product, soldOut }) {
  const id = product?._id ? String(product._id) : "";
  if (!id) return null;
  return <RecoList productIds={[id]} source="product" layout="list" />;
}

export const slots = {
  "cart.beforeSummary": { module: "upsell", Component: CartSlot },
  "productPage.afterActions": { module: "upsell", Component: ProductSlot },
};
