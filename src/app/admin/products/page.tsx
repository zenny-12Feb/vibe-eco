"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatVnd } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  category: "Do choi",
  stock: 50,
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/products?all=1");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      stock: p.stock,
      isActive: p.isActive,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Co loi xay ra");
      return;
    }

    setShowForm(false);
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoa san pham nay? Hanh dong khong the hoan tac.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function toggleActive(p: Product) {
    await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    loadProducts();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-ink">San pham 🧸</h1>
        <button
          onClick={openCreateForm}
          className="btn-chunky bg-bubblegum px-5 py-2.5 text-white hover:bg-bubblegum-dark"
        >
          + Them san pham
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-ink/50">Dang tai...</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-center text-ink/50">Chua co san pham nao.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card-sticker overflow-hidden p-4">
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">🎁</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold text-ink">{p.name}</p>
                  <p className="text-sm font-bold text-bubblegum">{formatVnd(p.price)}</p>
                  <p className="text-xs text-ink/50">Kho: {p.stock} · {p.category}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => toggleActive(p)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    p.isActive ? "bg-grass-light text-grass-dark" : "bg-ink/10 text-ink/50"
                  }`}
                >
                  {p.isActive ? "Dang ban" : "Da an"}
                </button>
                <button
                  onClick={() => openEditForm(p)}
                  className="ml-auto rounded-full px-3 py-1 text-xs font-bold text-lagoon-dark hover:bg-lagoon-light"
                >
                  Sua
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full px-3 py-1 text-xs font-bold text-bubblegum-dark hover:bg-bubblegum-light"
                >
                  Xoa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4">
          <div className="card-sticker max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <h2 className="font-display text-xl font-bold text-ink">
              {editingId ? "Sua san pham" : "Them san pham moi"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                required
                placeholder="Ten san pham"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Mo ta"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                rows={2}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  required
                  type="number"
                  min={0}
                  placeholder="Gia (VND)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="input-field"
                />
                <input
                  required
                  type="number"
                  min={0}
                  placeholder="Ton kho"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <input
                placeholder="Danh muc (vd: Do choi)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              />
              <input
                placeholder="URL hinh anh"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="input-field"
              />

              {error && (
                <p className="rounded-xl bg-bubblegum-light p-3 text-sm font-bold text-bubblegum-dark">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-chunky flex-1 bg-cream text-ink hover:bg-ink/10"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  className="btn-chunky flex-1 bg-grass text-white hover:bg-grass-dark"
                >
                  Luu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
