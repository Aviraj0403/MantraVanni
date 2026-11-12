import Axios from "../../utils/Axios";

/** Service booking storefront API (/v1/api/service-booking). Reads fail soft; actions throw so the UI can show the server message. */
const B = "/service-booking";
export const getBookingConfig = () => Axios.get(`${B}/config`, { timeout: 8000 }).then((r) => (r?.data?.success ? r.data.config : null)).catch(() => null);
export const getServices = () => Axios.get(`${B}/services`, { timeout: 10000 }).then((r) => r.data?.services || []);
export const getService = (id) => Axios.get(`${B}/services/${encodeURIComponent(id)}`, { timeout: 10000 }).then((r) => r.data?.service || null);
export const getSlots = (id, date) => Axios.get(`${B}/services/${encodeURIComponent(id)}/slots`, { params: { date }, timeout: 10000 }).then((r) => r.data?.slots || []);
export const createBooking = (body) => Axios.post(`${B}/book`, body).then((r) => r.data);
export const verifyBooking = (body) => Axios.post(`${B}/book/verify`, body).then((r) => r.data);
export const getMyBookings = () => Axios.get(`${B}/mine`).then((r) => r.data?.bookings || []);
export const cancelBooking = (id, reason) => Axios.post(`${B}/${id}/cancel`, { reason }).then((r) => r.data);

export const apiMessage = (e, fallback) => {
  const st = e?.response?.status;
  const m = e?.response?.data?.message;
  return st && st < 500 && m ? m : fallback;
};

export const rs = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export const fmtWhen = (d) => (d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : "");

/** YYYY-MM-DD in IST for `offset` days from now */
export const istDayOffset = (offset = 0) => new Date(Date.now() + 330 * 60000 + offset * 86400000).toISOString().slice(0, 10);

export const loadRazorpay = () => new Promise((resolve) => {
  if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
  let tries = 0;
  const t = setInterval(() => { if (window.Razorpay) { clearInterval(t); resolve(true); } else if (++tries > 20) { clearInterval(t); resolve(false); } }, 250);
});

export const inputCls = "w-full rounded-xl border border-secondary-200 px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary-500";
export const btnCls = "inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-primary-600 disabled:opacity-50";
