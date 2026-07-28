"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatVnd } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-6xl">🧾</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
          Ban chua co san pham nao de thanh toan!
        </h1>
        <Link
          href="/"
          className="btn-chunky mt-6 inline-flex bg-bubblegum px-6 py-3 text-white hover:bg-bubblegum-dark"
        >
          Ve trang chu
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError("Vui long nhap day du ho ten va so dien thoai nhe.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Co loi xay ra, vui long thu lai.");
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/order/${data.order.code}`);
    } catch {
      setError("Khong the ket noi may chu, vui long thu lai.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Thong tin giao hang 🚚</h1>

      <div className="mt-6 grid gap-8 sm:grid-cols-5">
        <form onSubmit={handleSubmit} className="card-sticker space-y-4 p-6 sm:col-span-3">
          <Field label="Ho va ten *">
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="input-field"
              placeholder="Nguyen Van A"
            />
          </Field>
          <Field label="So dien thoai *">
            <input
              required
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="input-field"
              placeholder="0901234567"
            />
          </Field>
          <Field label="Dia chi nhan hang">
            <input
              value={form.customerAddress}
              onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
              className="input-field"
              placeholder="So nha, duong, phuong/xa, tinh/thanh"
            />
          </Field>
          <Field label="Ghi chu">
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Vi du: giao gio hanh chinh..."
            />
          </Field>

          {error && (
            <p className="rounded-xl bg-bubblegum-light p-3 text-sm font-bold text-bubblegum-dark">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-chunky w-full bg-bubblegum py-3 text-lg text-white hover:bg-bubblegum-dark disabled:opacity-50"
          >
            {submitting ? "Dang tao don..." : "Tao don & Lay ma QR ✨"}
          </button>
        </form>

        <div className="card-sticker h-fit p-6 sm:col-span-2">
          <h2 className="font-display text-lg font-bold text-ink">Don hang cua ban</h2>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {i.name} × {i.quantity}
                </span>
                <span className="font-bold text-ink">{formatVnd(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t-2 border-dashed border-cream pt-4">
            <span className="font-bold text-ink/60">Tong cong</span>
            <span className="font-display text-xl font-extrabold text-bubblegum">
              {formatVnd(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink/60">{label}</span>
      {children}
    </label>
  );
}
