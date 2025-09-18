// Simple currency formatter helper for INR
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function formatCurrency(value) {
  const n = Number(value) || 0;
  return inrFormatter.format(n);
}
