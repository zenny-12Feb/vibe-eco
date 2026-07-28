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
    label: "Ch\u1EDD thanh to\u00E1n",
    emoji: "\u{1F4B3}",
    color: "text-sunshine-dark",
    bg: "bg-sunshine-light",
  },
  PAID: {
    label: "\u0110\u00E3 thanh to\u00E1n",
    emoji: "\u{1F4B0}",
    color: "text-lagoon-dark",
    bg: "bg-lagoon-light",
  },
  PROCESSING: {
    label: "\u0110ang chu\u1EA9n b\u1ECB h\u00E0ng",
    emoji: "\u{1F4E6}",
    color: "text-berry-dark",
    bg: "bg-berry-light",
  },
  SHIPPING: {
    label: "\u0110ang giao h\u00E0ng",
    emoji: "\u{1F69A}",
    color: "text-berry-dark",
    bg: "bg-berry-light",
  },
  COMPLETED: {
    label: "Ho\u00E0n th\u00E0nh",
    emoji: "\u{1F389}",
    color: "text-grass-dark",
    bg: "bg-grass-light",
  },
  CANCELLED: {
    label: "\u0110\u00E3 h\u1EE7y",
    emoji: "\u274C",
    color: "text-bubblegum-dark",
    bg: "bg-bubblegum-light",
  },
};
