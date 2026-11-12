import axios from "../../utils/Axios";

/**
 * Client side of the multi-gateway add-on. The browser never decides whether a payment succeeded: every path ends in
 * POST /multi-gateway/verify, where the server asks the gateway itself. Amounts are never sent from here.
 */

const CASHFREE_SDK = "https://sdk.cashfree.com/js/v3/cashfree.js"; // hard-coded: not taken from the server response
const PAYU_ACTIONS = ["https://secure.payu.in/_payment", "https://test.payu.in/_payment"];
const PENDING_KEY = "mgPendingPayment";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const rememberGatewayPayment = (paymentId, gateway) => {
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ paymentId, gateway, at: Date.now() })); } catch { /* storage unavailable */ }
};
export const forgetGatewayPayment = () => {
  try { sessionStorage.removeItem(PENDING_KEY); } catch { /* storage unavailable */ }
};

let cashfreeLoading = null;
const loadCashfreeSdk = () => {
  if (typeof window !== "undefined" && window.Cashfree) return Promise.resolve();
  if (!cashfreeLoading) {
    cashfreeLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = CASHFREE_SDK;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { cashfreeLoading = null; s.remove(); reject(new Error("Payment gateway could not be loaded. Please refresh and try again.")); };
      document.head.appendChild(s);
    });
  }
  return cashfreeLoading;
};

/** Creates the gateway order on the server (server-priced cart). Returns the server payload. Throws axios errors. */
export const createGatewayOrder = async (gateway, payload) => {
  const { data } = await axios.post("/multi-gateway/create", { ...payload, gateway }, { withCredentials: true, timeout: 20000 });
  if (!data?.success || !data.paymentId) throw new Error(data?.message || "Failed to create payment order");
  return data;
};

/**
 * Opens Cashfree's checkout in a modal. Resolves with { redirected: true } when the SDK navigates away (the return URL then
 * brings the customer back to /checkout?gw=cashfree&pid=...), otherwise { redirected: false, error? } once the modal is closed.
 */
export const openCashfree = async (data) => {
  const sid = data?.cashfree?.paymentSessionId;
  if (!sid || typeof sid !== "string") throw new Error("Payment session missing. Please try again.");
  await loadCashfreeSdk();
  if (!window.Cashfree) throw new Error("Payment gateway could not be loaded. Please refresh and try again.");
  const cashfree = window.Cashfree({ mode: data.cashfree.mode === "production" ? "production" : "sandbox" });
  const result = await cashfree.checkout({ paymentSessionId: sid, redirectTarget: "_modal" });
  if (result?.redirect) return { redirected: true };
  return { redirected: false, error: result?.error?.message ? String(result.error.message).slice(0, 200) : "" };
};

/** Auto-submitted PayU hosted-checkout form. Leaves the page (PayU later POSTs back to the server, which redirects to /checkout?gw=payu&pid=...). */
export const submitPayuForm = (data) => {
  const p = data?.payu;
  if (!p || !PAYU_ACTIONS.includes(p.action) || !p.fields || typeof p.fields !== "object") throw new Error("Payment form missing. Please try again.");
  const form = document.createElement("form");
  form.method = "POST";
  form.action = p.action;
  form.style.display = "none";
  form.acceptCharset = "UTF-8";
  for (const [k, v] of Object.entries(p.fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = String(v ?? "");
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
};

/**
 * Asks the server to verify with the gateway and create the order. Retries while the answer is "processing"/"pending"
 * (webhook / bank delays). Returns { kind, order?, orderId?, items?, message? } with kind in
 * order | pending | failed | mismatch | stock | error.
 */
export const verifyGatewayPayment = async (paymentId, { attempts = 1, delayMs = 3000 } = {}) => {
  let last = { kind: "pending" };
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await sleep(delayMs);
    try {
      const { data, status } = await axios.post("/multi-gateway/verify", { paymentId }, { withCredentials: true, timeout: 20000 });
      if (status === 202 || data?.status === "processing") { last = { kind: "pending" }; continue; }
      if (data?.success) {
        const order = data.order || {};
        const orderId = data.orderId || order._id || order.id;
        if (orderId) return { kind: "order", order: { ...order, _id: orderId, id: orderId }, orderId };
        return { kind: "error", message: "Order was created but its ID was not received. Please check your orders in your profile." };
      }
      last = { kind: "error", message: data?.message };
    } catch (err) {
      const r = err?.response;
      const code = r?.data?.code;
      if (r?.status === 409 && code === "PAYMENT_PENDING") { last = { kind: "pending" }; continue; }
      if (r?.status === 409 && code === "OUT_OF_STOCK") return { kind: "stock", items: r.data.items };
      if (r?.status === 402 && code === "PAYMENT_FAILED") return { kind: "failed", message: r.data?.message };
      if (r?.status === 402 && code === "PAYMENT_AMOUNT_MISMATCH") return { kind: "mismatch", message: r.data?.message };
      if (r?.status === 409 && code === "PAYMENT_REFUNDED") return { kind: "failed", message: r.data?.message };
      if (r?.status === 404 || r?.status === 400 || r?.status === 401 || r?.status === 403) return { kind: "error", message: r.data?.message };
      last = { kind: "error", message: r?.data?.message }; // network / 5xx: try again if attempts remain
    }
  }
  return last;
};
