// Short-lived checkout recovery data (payment id + shipping address = PII).
// Lives in sessionStorage only, is cleared on success/failure and is dropped when older than 15 minutes.
const PAYMENT_KEY = 'pendingPaymentData';
const CART_KEY = 'pendingCartData';
export const PENDING_MAX_AGE_MS = 15 * 60 * 1000;

const read = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ...value, timestamp: new Date().toISOString() }));
  } catch { /* storage unavailable */ }
};

const isStale = (entry) => {
  const t = entry?.timestamp ? new Date(entry.timestamp).getTime() : NaN;
  return !Number.isFinite(t) || Date.now() - t > PENDING_MAX_AGE_MS;
};

export const savePendingPayment = (payment, cart) => {
  write(PAYMENT_KEY, payment);
  write(CART_KEY, cart);
};

/** Flag set from the Razorpay success handler: money was captured, so the order may need recovery. */
export const markPaymentCaptured = () => {
  const payment = read(PAYMENT_KEY);
  if (payment) write(PAYMENT_KEY, { ...payment, captured: true });
};

export const getPendingPayment = () => {
  const payment = read(PAYMENT_KEY);
  if (!payment || isStale(payment)) {
    clearPendingPayment();
    return null;
  }
  return { payment, cart: read(CART_KEY) };
};

export const clearPendingPayment = () => {
  try {
    sessionStorage.removeItem(PAYMENT_KEY);
    sessionStorage.removeItem(CART_KEY);
  } catch { /* storage unavailable */ }
};

/** Run once at app start: removes expired entries (no-op when nothing is stored). */
export const cleanupStalePaymentData = () => {
  const payment = read(PAYMENT_KEY);
  const cart = read(CART_KEY);
  if ((payment && isStale(payment)) || (cart && isStale(cart))) clearPendingPayment();
};
