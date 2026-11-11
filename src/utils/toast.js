// Single toast API for the storefront (react-hot-toast). Keeps the small react-toastify-style
// surface (success / error / info / warn) the existing call sites use.
import hotToast from 'react-hot-toast';

const mapOpts = (opts = {}) => {
  const { autoClose, ...rest } = opts || {};
  if (autoClose === false) return { ...rest, duration: Infinity };
  if (typeof autoClose === 'number') return { ...rest, duration: autoClose };
  return rest;
};

const info = (msg, opts) => hotToast(msg, { icon: 'ℹ️', ...mapOpts(opts) });
const warn = (msg, opts) => hotToast(msg, { icon: '⚠️', ...mapOpts(opts) });

export const toast = Object.assign(
  (msg, opts) => hotToast(msg, mapOpts(opts)),
  {
    success: (msg, opts) => hotToast.success(msg, mapOpts(opts)),
    error: (msg, opts) => hotToast.error(msg, mapOpts(opts)),
    info,
    warn,
    warning: warn,
    dismiss: hotToast.dismiss,
    loading: (msg, opts) => hotToast.loading(msg, mapOpts(opts)),
  }
);

export default toast;
