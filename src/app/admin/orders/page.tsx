"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatVnd } from "@/lib/utils";
import { ORDER_STATUS_META, OrderStatusKey } from "@/lib/order-status";
import StatusBadge from "@/components/StatusBadge";

type OrderItem = {
  id: string;
  productName: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  note: string;
  totalAmount: number;
  status: OrderStatusKey;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_OPTIONS: OrderStatusKey[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingCode, setUpdatingCode] = useState<string | null>(null);

  async function loadOrders(status = filter) {
    setLoading(true);
    const url = status ? `/api/orders?status=${status}` : "/api/orders";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleStatusChange(code: string, status: OrderStatusKey) {
    setUpdatingCode(code);
    await fetch(`/api/orders/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadOrders();
    setUpdatingCode(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Don hang 📦</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip label="Tat ca" active={filter === ""} onClick={() => setFilter("")} />
        {STATUS_OPTIONS.map((s) => (
          <FilterChip
            key={s}
            label={`${ORDER_STATUS_META[s].emoji} ${ORDER_STATUS_META[s].label}`}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-center text-ink/50">Dang tai...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-center text-ink/50">Khong co don hang nao.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card-sticker p-4">
              <div
                className="flex cursor-pointer flex-wrap items-center gap-3"
                onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
              >
                <div className="min-w-[120px]">
                  <Link
                    href={`/order/${o.code}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="font-display font-bold text-ink hover:text-bubblegum"
                  >
                    {o.code}
                  </Link>
                  <p className="text-xs text-ink/40">
                    {new Date(o.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="min-w-[140px] flex-1">
                  <p className="font-bold text-ink">{o.customerName}</p>
                  <p className="text-xs text-ink/50">{o.customerPhone}</p>
                </div>
                <p className="font-display font-extrabold text-bubblegum">
                  {formatVnd(o.totalAmount)}
                </p>
                <StatusBadge status={o.status} />

                <select
                  value={o.status}
                  disabled={updatingCode === o.code}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleStatusChange(o.code, e.target.value as OrderStatusKey)
                  }
                  className="rounded-full border-2 border-cream bg-white px-3 py-1.5 text-sm font-bold text-ink"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_META[s].emoji} {ORDER_STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>

              {expandedId === o.id && (
                <div className="mt-4 border-t-2 border-dashed border-cream pt-4">
                  {o.customerAddress && (
                    <p className="text-sm text-ink/70">
                      <span className="font-bold text-ink/50">Dia chi:</span> {o.customerAddress}
                    </p>
                  )}
                  {o.note && (
                    <p className="mt-1 text-sm text-ink/70">
                      <span className="font-bold text-ink/50">Ghi chu:</span> {o.note}
                    </p>
                  )}
                  <ul className="mt-2 space-y-1">
                    {o.items.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span className="text-ink/70">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-bold text-ink">
                          {formatVnd(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
        active ? "bg-berry text-white" : "bg-white text-ink/60 shadow-chunky-sm hover:bg-cream"
      }`}
    >
      {label}
    </button>
  );
}
