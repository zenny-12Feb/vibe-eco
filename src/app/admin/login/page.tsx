"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Đăng nhập thất bại");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 sm:px-6">
      <div className="card-sticker w-full p-8">
        <div className="text-center">
          <span className="text-5xl">🔐</span>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
            Đăng nhập Quản trị
          </h1>
          <p className="mt-1 text-sm text-ink/60">Bộp Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập"
            className="input-field"
            autoFocus
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="input-field"
          />

          {error && (
            <p className="rounded-xl bg-bubblegum-light p-3 text-sm font-bold text-bubblegum-dark">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-chunky w-full bg-berry py-3 text-white hover:bg-berry-dark disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
