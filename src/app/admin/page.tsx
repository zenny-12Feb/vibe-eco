import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, pendingCount, revenueAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPING", "COMPLETED"] } },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Sản phẩm", value: productCount, emoji: "🧸", color: "bg-sunshine-light text-sunshine-dark" },
    { label: "Tổng đơn hàng", value: orderCount, emoji: "📦", color: "bg-lagoon-light text-lagoon-dark" },
    { label: "Chờ thanh toán", value: pendingCount, emoji: "💳", color: "bg-bubblegum-light text-bubblegum-dark" },
    {
      label: "Doanh thu (đã xác nhận)",
      value: formatVnd(revenueAgg._sum.totalAmount || 0),
      emoji: "💰",
      color: "bg-grass-light text-grass-dark",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Xin chào, Admin! 👋</h1>
      <p className="mt-1 text-ink/60">Tổng quan cửa hàng Bộp.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-sticker p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xl ${s.color}`}>
              {s.emoji}
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-sticker mt-8 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Đơn hàng gần đây</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-lagoon-dark hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-ink/40">
                  <th className="pb-2">Mã đơn</th>
                  <th className="pb-2">Khách hàng</th>
                  <th className="pb-2">Tổng tiền</th>
                  <th className="pb-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-cream">
                    <td className="py-2 font-bold text-ink">{o.code}</td>
                    <td className="py-2 text-ink/70">{o.customerName}</td>
                    <td className="py-2 font-bold text-bubblegum">{formatVnd(o.totalAmount)}</td>
                    <td className="py-2 text-ink/60">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
