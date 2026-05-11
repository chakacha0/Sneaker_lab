/** Values must match backend orders_repo.ALLOWED_ORDER_STATUSES */
export const ORDER_STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "assembled", label: "Assembled" },
  { value: "handed_to_delivery", label: "Handed to delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function getOrderStatusLabel(status) {
  const key = status || "processing";
  const opt = ORDER_STATUS_OPTIONS.find((o) => o.value === key);
  return opt ? opt.label : key;
}
