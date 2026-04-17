import dayjs from "dayjs";

export function formatCurrency(
  value: number,
  currency: string = "INR",
): string {
  try {
    const formatter = new Intl.NumberFormat("INR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  } catch (error) {
    // Fallback: format as ₹ with two decimal places
    return `₹ ${value.toFixed(2)}`;
  }
}

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};