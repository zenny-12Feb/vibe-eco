"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatVnd } from "@/lib/utils";
import { costPerUnitFromPackage, sellPriceFromMargin } from "@/lib/pricing";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  imageUrl: string;
  category: string;
  stock: number;
  itemsPerBlock: number;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  costPrice: 0,
  imageUrl: "",
  category: "Đồ chơi",
  stock: 50,
  itemsPerBlock: 1,
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [marginPercent, setMarginPercent] = useState(0);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function autoPrice(costPrice: number, itemsPerBlock: number, margin: number): number {
    const costPerItem = costPerUnitFromPackage(costPrice, itemsPerBlock);
    return Math.round(sellPriceFromMargin(costPerItem, margin));
  }

  function marginFromPrice(price: number, costPrice: number, itemsPerBlock: number): number {
    const costPerItem = costPerUnitFromPackage(costPrice, itemsPerBlock);
    if (costPerItem <= 0) return 0;
    return Math.round(((price - costPerItem) / costPerItem) * 100 * 10) / 10;
  }

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
    setMarginPercent(0);
    setError("");
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      costPrice: p.costPrice,
      imageUrl: p.imageUrl,
      category: p.category,
      stock: p.stock,
      itemsPerBlock: p.itemsPerBlock,
      isActive: p.isActive,
    });
    setMarginPercent(marginFromPrice(p.price, p.costPrice, p.itemsPerBlock));
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
      setError(typeof data.error === "string" ? data.error : "Có lỗi xảy ra");
      return;
    }

    setShowForm(false);
    loadProducts();
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });

      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        // response wasn't JSON (e.g. server crashed with an HTML error page)
      }

      if (!res.ok || !data.url) {
        setError(typeof data.error === "string" ? data.error : "Upload ảnh thất bại");
        return;
      }
      setForm((f) => ({ ...f, imageUrl: data.url as string }));
    } catch {
      setError("Upload ảnh thất bại, kiểm tra kết nối mạng");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa sản phẩm này? Hành động không thể hoàn tác.")) return;
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
        <h1 className="font-display text-3xl font-extrabold text-ink">Sản phẩm 🧸</h1>
        <button
          onClick={openCreateForm}
          className="btn-chunky bg-bubblegum px-5 py-2.5 text-white hover:bg-bubblegum-dark"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-ink/50">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-center text-ink/50">Chưa có sản phẩm nào.</p>
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
                  <p className="text-xs text-ink/50">
                    Kho: {p.stock} block · {p.itemsPerBlock} item/block · {p.category}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => toggleActive(p)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    p.isActive ? "bg-grass-light text-grass-dark" : "bg-ink/10 text-ink/50"
                  }`}
                >
                  {p.isActive ? "Đang bán" : "Đã ẩn"}
                </button>
                <button
                  onClick={() => openEditForm(p)}
                  className="ml-auto rounded-full px-3 py-1 text-xs font-bold text-lagoon-dark hover:bg-lagoon-light"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full px-3 py-1 text-xs font-bold text-bubblegum-dark hover:bg-bubblegum-light"
                >
                  Xóa
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
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <Field label="Tên sản phẩm">
                <input
                  required
                  placeholder="Tên sản phẩm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </Field>
              <Field label="Mô tả">
                <textarea
                  placeholder="Mô tả"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Giá vốn/block (VND)">
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.costPrice}
                    onChange={(e) => {
                      const costPrice = Number(e.target.value);
                      setForm((f) => ({
                        ...f,
                        costPrice,
                        price: autoPrice(costPrice, f.itemsPerBlock, marginPercent),
                      }));
                    }}
                    className="input-field"
                  />
                </Field>
                <Field label="Số lượng item/block">
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.itemsPerBlock}
                    onChange={(e) => {
                      const itemsPerBlock = Number(e.target.value);
                      setForm((f) => ({
                        ...f,
                        itemsPerBlock,
                        price: autoPrice(f.costPrice, itemsPerBlock, marginPercent),
                      }));
                    }}
                    className="input-field"
                  />
                </Field>
                <Field label="Biên lợi nhuận (%)">
                  <input
                    type="number"
                    value={marginPercent}
                    onChange={(e) => {
                      const margin = Number(e.target.value) || 0;
                      setMarginPercent(margin);
                      setForm((f) => ({ ...f, price: autoPrice(f.costPrice, f.itemsPerBlock, margin) }));
                    }}
                    className="input-field"
                  />
                </Field>
                <Field label="Giá bán/item (VND)">
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="input-field"
                  />
                  <p className="mt-1 text-xs text-ink/40">Tự tính từ giá vốn + biên lợi nhuận, có thể sửa tay</p>
                </Field>
                <Field label="Tồn kho (số block)">
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="input-field"
                  />
                </Field>
              </div>
              <Field label="Danh mục">
                <input
                  placeholder="vd: Đồ chơi"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field"
                />
              </Field>
              <Field label="Hình ảnh">
                <div className="flex items-center gap-3">
                  {form.imageUrl && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <Image src={form.imageUrl} alt="preview" fill className="object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="input-field"
                    disabled={uploading}
                  />
                </div>
                {uploading && <p className="mt-1 text-xs text-ink/50">Đang tải ảnh lên...</p>}
              </Field>

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
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-chunky flex-1 bg-grass text-white hover:bg-grass-dark disabled:opacity-50"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-ink/60">{label}</label>
      {children}
    </div>
  );
}
