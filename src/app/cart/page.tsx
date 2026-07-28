"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import QuantityStepper from "@/components/QuantityStepper";
import { formatVnd } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
          Gio hang dang trong nhi!
        </h1>
        <p className="mt-2 text-ink/60">Hay chon vai mon do that thich nhe.</p>
        <Link
          href="/"
          className="btn-chunky mt-6 inline-flex bg-bubblegum px-6 py-3 text-white hover:bg-bubblegum-dark"
        >
          Kham pha ngay 🎈
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">🛒 Gio hang cua ban</h1>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="card-sticker flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">🎁</div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold text-ink">{item.name}</p>
                <p className="font-bold text-bubblegum">{formatVnd(item.price)}</p>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Xoa ${item.name}`}
                className="shrink-0 rounded-full p-2 text-xl text-ink/30 transition hover:bg-bubblegum-light hover:text-bubblegum-dark sm:hidden"
              >
                🗑️
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 sm:contents">
              <QuantityStepper
                value={item.quantity}
                onChange={(q) => updateQuantity(item.productId, q)}
                max={item.stock}
              />

              <div className="text-right font-display font-extrabold text-ink sm:w-28 sm:shrink-0">
                {formatVnd(item.price * item.quantity)}
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Xoa ${item.name}`}
                className="hidden shrink-0 rounded-full p-2 text-xl text-ink/30 transition hover:bg-bubblegum-light hover:text-bubblegum-dark sm:block"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card-sticker mt-8 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div>
          <p className="text-sm font-bold text-ink/50">Tong cong</p>
          <p className="font-display text-3xl font-extrabold text-bubblegum">
            {formatVnd(totalAmount)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="btn-chunky w-full bg-grass px-8 py-3 text-lg text-white hover:bg-grass-dark sm:w-auto"
        >
          Thanh toan ngay 💳
        </Link>
      </div>
    </div>
  );
}
