export type OrderStatusKey =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_STATUS_FLOW: OrderStatusKey[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPING",
  "COMPLETED",
];

export const ORDER_STATUS_META: Record<
  OrderStatusKey,
  { label: string; emoji: string; color: string; bg: string }
> = {
  PENDING_PAYMENT: {
    label: "Cho thanh toan",
    emoji: "\u{1F4B3}",
    color: "text-sunshine-dark",
    bg: "bg-sunshine-light",
  },
  PAID: {
    label: "Da thanh toan",
    emoji: "\u{1F4B0}",
    color: "text-lagoon-dark",
    bg: "bg-lagoon-light",
  },
  PROCESSING: {
    label: "Dang chuan bi hang",
    emoji: "\u{1F4E6}",
    color: "text-berry-dark",
    bg: "bg-berry-light",
  },
  SHIPPING: {
    label: "Dang giao hang",
    emoji: "\u{1F69A}",
    color: "text-berry-dark",
    bg: "bg-berry-light",
  },
  COMPLETED: {
    label: "Hoan thanh",
    emoji: "\u{1F389}",
    color: "text-grass-dark",
    bg: "bg-grass-light",
  },
  CANCELLED: {
    label: "Da huy",
    emoji: "\u274C",
    color: "text-bubblegum-dark",
    bg: "bg-bubblegum-light",
  },
};
