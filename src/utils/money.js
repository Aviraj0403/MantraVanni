// INR formatting with Indian digit grouping (e.g. 1,23,456.00).
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inrWhole = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatINR = (value, { whole = false } = {}) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return (whole ? inrWhole : inr).format(n);
};

export default formatINR;
