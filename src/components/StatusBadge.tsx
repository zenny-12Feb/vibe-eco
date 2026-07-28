import { ORDER_STATUS_META, OrderStatusKey } from "@/lib/order-status";

export default function StatusBadge({ status }: { status: OrderStatusKey }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${meta.bg} ${meta.color}`}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
