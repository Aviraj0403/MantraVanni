import Axios from "../../utils/Axios";

/** Photo / video reviews & Q&A storefront API (/ugc-reviews). 403/404 means the add-on is off: callers treat any failure as "render nothing". */
const B = "/ugc-reviews";
const body = (r) => r?.data || {};

export const getUgcPublicConfig = async () => body(await Axios.get(`${B}/config`, { timeout: 8000 })).config || null;
export const getGallery = async (productId) => body(await Axios.get(`${B}/gallery`, { params: { productId }, timeout: 8000 })).items || [];
export const getQuestions = async (productId, page = 1) => body(await Axios.get(`${B}/questions`, { params: { productId, page, limit: 5 }, timeout: 8000 }));
export const askQuestion = async (productId, question) => body(await Axios.post(`${B}/questions`, { productId, question }));
export const answerQuestion = async (id, text) => body(await Axios.post(`${B}/questions/${id}/answers`, { text }));
export const markHelpful = async (id) => body(await Axios.post(`${B}/questions/${id}/helpful`));
export const getUploadSignature = async (type) => body(await Axios.post(`${B}/upload-signature`, { type })).upload;
export const attachReviewMedia = async (reviewId, media) => body(await Axios.post(`${B}/reviews/${reviewId}/media`, { media })).review;

export const apiMessage = (e, fb) => e?.response?.data?.message || fb;

/** Seconds of a local video file (0 when the browser cannot tell). */
const videoSeconds = (file) => new Promise((resolve) => {
  try {
    const v = document.createElement("video");
    const url = URL.createObjectURL(file);
    const done = (n) => { URL.revokeObjectURL(url); resolve(n); };
    v.preload = "metadata";
    v.onloadedmetadata = () => done(Number.isFinite(v.duration) ? v.duration : 0);
    v.onerror = () => done(0);
    v.src = url;
  } catch { resolve(0); }
});

/**
 * Uploads one image / video straight to this store's Cloudinary folder using a server-signed permission.
 * Resolves { type, url, bytes, duration }. Throws Error(message) with a shopper-friendly message.
 */
export const uploadMedia = async (file, limits) => {
  const type = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
  if (!type) throw new Error("Please choose a photo or a video.");
  if (type === "video" && limits && limits.allowVideos === false) throw new Error("Videos are not accepted for this store.");
  const maxMB = type === "image" ? Math.min(limits?.maxFileMB || 10, 10) : limits?.maxFileMB || 15;
  if (file.size > maxMB * 1024 * 1024) throw new Error(`File is too large (max ${maxMB} MB).`);
  let duration = 0;
  if (type === "video") {
    duration = await videoSeconds(file);
    if (limits?.maxVideoSeconds && duration > limits.maxVideoSeconds) throw new Error(`Video is too long (max ${limits.maxVideoSeconds} seconds).`);
  }
  let sig;
  try { sig = await getUploadSignature(type); } catch (e) { throw new Error(apiMessage(e, "Uploads are not available right now.")); }
  if (!sig?.signature) throw new Error("Uploads are not available right now.");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);
  fd.append("allowed_formats", sig.allowed_formats);
  let res;
  try { res = await fetch(sig.uploadUrl, { method: "POST", body: fd }); } catch { throw new Error("Upload failed. Check your connection."); }
  if (!res.ok) throw new Error("Upload failed. Please try a different file.");
  const j = await res.json();
  if (!j?.secure_url) throw new Error("Upload failed.");
  return { type, url: j.secure_url, bytes: j.bytes || file.size, duration: j.duration || duration || undefined };
};
