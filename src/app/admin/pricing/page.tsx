"use client";

import { useEffect, useState } from "react";
import { formatVnd } from "@/lib/utils";
import {
  costPerUnitFromPackage,
  sellPriceFromMargin,
  profitPerUnit,
} from "@/lib/pricing";

type Product = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  itemsPerBlock: number;
};

type Row = {
  id: string;
  productId: string;
  packageQuantity: number;
  itemsPerPackage: number;
  packageCost: number;
  marginPercent: number | null;
  savedPrice: number | null;
};

function rowFromProduct(product: Product): Row {
  return {
    id: crypto.randomUUID(),
    productId: product.id,
    // So luong goi, so luong item/goi va gia von luon lay theo du lieu ben san pham, khong cho nhap tay
    packageQuantity: product.stock ?? 0,
    itemsPerPackage: product.itemsPerBlock ?? 1,
    packageCost: product.costPrice ?? 0,
    marginPercent: null,
    savedPrice: product.price,
  };
}

export default function AdminPricingPage() {
  const [defaultMarginPercent, setDefaultMarginPercent] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products?all=1")
      .then((res) => res.json())
      .then((data) => {
        const list: Product[] = data.products || [];
        setProducts(list);
        setRows(list.map(rowFromProduct));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  function costPerUnit(row: Row): number {
    return costPerUnitFromPackage(row.packageCost, row.itemsPerPackage);
  }

  function totalItems(row: Row): number {
    return (row.packageQuantity || 0) * (row.itemsPerPackage || 0);
  }

  // Moi san pham co the tu set % rieng, neu khong set thi lay % chung o tren
  function effectiveMargin(row: Row): number {
    return row.marginPercent ?? defaultMarginPercent;
  }

  // Gia ban/item luon tu tinh = gia von/item * (1 + bien loi nhuan), khong cho sua tay
  function sellPriceOf(cost: number, margin: number): number {
    return Math.round(sellPriceFromMargin(cost, margin));
  }

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function resetRow(row: Row) {
    const product = products.find((p) => p.id === row.productId);
    if (!product) return;
    updateRow(row.id, {
      packageQuantity: product.stock ?? 0,
      itemsPerPackage: product.itemsPerBlock ?? 1,
      packageCost: product.costPrice ?? 0,
      marginPercent: null,
      savedPrice: product.price,
    });
  }

  async function saveRowPrice(row: Row, price: number) {
    setSavingId(row.id);
    const res = await fetch(`/api/products/${row.productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    setSavingId(null);
    if (res.ok) {
      updateRow(row.id, { savedPrice: price });
    }
  }

  const summary = rows.reduce(
    (acc, row) => {
      const cost = costPerUnit(row);
      const items = totalItems(row);
      const totalCost = cost * items;
      const totalRevenue = sellPriceOf(cost, effectiveMargin(row)) * items;
      return {
        quantity: acc.quantity + items,
        totalCost: acc.totalCost + totalCost,
        totalRevenue: acc.totalRevenue + totalRevenue,
      };
    },
    { quantity: 0, totalCost: 0, totalRevenue: 0 }
  );
  const totalProfit = summary.totalRevenue - summary.totalCost;
  const avgMargin = summary.totalCost > 0 ? (totalProfit / summary.totalCost) * 100 : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Cấu hình giá 🧮</h1>
      <p className="mt-1 text-sm text-ink/60">
        Số lượng gói, số lượng item/gói và giá vốn được lấy tự động từ sản phẩm. Chỉ cần nhập biên lợi nhuận mong muốn để tính giá bán/item và lưu vào sản phẩm.
      </p>

      <div className="card-sticker mt-6 p-4">
        <div className="max-w-xs">
          <label className="mb-1 block text-xs font-bold text-ink/60">Biên lợi nhuận mong muốn (%)</label>
          <input
            type="number"
            value={defaultMarginPercent}
            onChange={(e) => setDefaultMarginPercent(Number(e.target.value) || 0)}
            className="input-field"
          />
        </div>
      </div>

      <div className="card-sticker mt-4 overflow-x-auto p-4">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="text-left text-xs font-bold text-ink/50">
              <th className="pb-2 pr-3">Sản phẩm</th>
              <th className="pb-2 pr-3">Số lượng gói</th>
              <th className="pb-2 pr-3">Số lượng item/gói</th>
              <th className="pb-2 pr-3">Giá vốn</th>
              <th className="pb-2 pr-3">Biên lợi nhuận %</th>
              <th className="pb-2 pr-3">Giá bán/item</th>
              <th className="pb-2 pr-3">Tổng lợi nhuận</th>
              <th className="pb-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-ink/50">
                  Đang tải sản phẩm...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-ink/50">
                  Chưa có sản phẩm nào trong hệ thống.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => {
              const product = products.find((p) => p.id === row.productId);
              const cost = costPerUnit(row);
              const items = totalItems(row);
              const margin = effectiveMargin(row);
              const sellPrice = sellPriceOf(cost, margin);
              const profit = profitPerUnit(cost, sellPrice);
              const totalRowProfit = profit * items;
              const isSaved = row.savedPrice === sellPrice;

              return (
                <tr key={row.id} className="border-t border-cream">
                  <td className="py-2 pr-3 align-top">
                    <div className="input-field truncate bg-cream/40 font-bold text-ink">
                      {product?.name || "—"}
                    </div>
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <div className="input-field bg-cream/40 font-bold text-ink">
                      {row.packageQuantity.toLocaleString("vi-VN")}
                    </div>
                    <p className="mt-1 text-xs text-ink/40">Theo tồn kho hiện có</p>
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <div className="input-field bg-cream/40 font-bold text-ink">
                      {row.itemsPerPackage.toLocaleString("vi-VN")}
                    </div>
                    <p className="mt-1 text-xs text-ink/40">Tổng {items.toLocaleString("vi-VN")} item</p>
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <div className="input-field bg-cream/40 font-bold text-ink">
                      {formatVnd(row.packageCost)}
                    </div>
                    <p className="mt-1 text-xs text-ink/40">≈ {formatVnd(Math.round(cost))}/item</p>
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <input
                      type="number"
                      placeholder={`${defaultMarginPercent}% (chung)`}
                      value={row.marginPercent ?? ""}
                      onChange={(e) =>
                        updateRow(row.id, {
                          marginPercent: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      className="input-field"
                    />
                    {row.marginPercent === null && (
                      <p className="mt-1 text-xs text-ink/40">Đang theo % chung</p>
                    )}
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <div className="input-field bg-cream/40 font-bold text-ink">{formatVnd(sellPrice)}</div>
                    <p className="mt-1 text-xs text-ink/40">Lãi {formatVnd(Math.round(profit))}/item</p>
                  </td>
                  <td className="py-2 pr-3 align-top font-bold text-grass-dark">
                    <div className="input-field bg-cream/40">{formatVnd(Math.round(totalRowProfit))}</div>
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <div className="flex h-12 items-center gap-2">
                      <button
                        onClick={() => saveRowPrice(row, sellPrice)}
                        disabled={savingId === row.id || isSaved}
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isSaved
                            ? "bg-grass-light text-grass-dark"
                            : "bg-lagoon-light text-lagoon-dark hover:bg-lagoon"
                        }`}
                      >
                        {isSaved ? "Đã lưu" : savingId === row.id ? "Đang lưu..." : "Lưu giá"}
                      </button>
                      <button
                        onClick={() => resetRow(row)}
                        className="rounded-full px-2 py-1 text-xs font-bold text-bubblegum-dark hover:bg-bubblegum-light"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card-sticker mt-4 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
        <Stat label="Tổng số lượng item" value={summary.quantity.toLocaleString("vi-VN")} />
        <Stat label="Tổng giá vốn" value={formatVnd(Math.round(summary.totalCost))} />
        <Stat label="Tổng doanh thu dự kiến" value={formatVnd(Math.round(summary.totalRevenue))} />
        <Stat
          label="Tổng lợi nhuận dự kiến"
          value={formatVnd(Math.round(totalProfit))}
          highlight
        />
        <Stat label="Biên lợi nhuận trung bình" value={`${avgMargin.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs font-bold text-ink/50">{label}</p>
      <p className={`text-lg font-extrabold ${highlight ? "text-bubblegum" : "text-ink"}`}>{value}</p>
    </div>
  );
}
