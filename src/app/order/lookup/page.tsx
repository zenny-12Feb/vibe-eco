"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderLookupPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/order/${trimmed.toUpperCase()}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <p className="text-6xl">🔎</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Tra cứu đơn hàng</h1>
      <p className="mt-2 text-ink/60">Nhập mã đơn hàng bạn đã nhận để xem trạng thái.</p>

      <form onSubmit={handleSubmit} className="card-sticker mt-6 space-y-4 p-6">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ví dụ: DHAB12C3"
          className="input-field text-center font-display text-lg tracking-widest"
          autoFocus
        />
        <button
          type="submit"
          className="btn-chunky w-full bg-lagoon py-3 text-white hover:bg-lagoon-dark"
        >
          Xem trạng thái 🚀
        </button>
      </form>
    </div>
  );
}
