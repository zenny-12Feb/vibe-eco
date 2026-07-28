import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildVietQrUrl, getBankAccountInfo } from "@/lib/vietqr";
import { formatVnd } from "@/lib/utils";
import { OrderStatusKey } from "@/lib/order-status";
import OrderProgress from "@/components/OrderProgress";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({
  params,
}: {
  params: { code: string };
}) {
  const order = await prisma.order.findUnique({
    where: { code: params.code.toUpperCase() },
    include: { items: true },
  });

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-6xl">🔍</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
          Không tìm thấy đơn hàng "{params.code}"
        </h1>
        <p className="mt-2 text-ink/60">Bạn kiểm tra lại mã đơn hàng nhé.</p>
        <Link
          href="/order/lookup"
          className="btn-chunky mt-6 inline-flex bg-lagoon px-6 py-3 text-white hover:bg-lagoon-dark"
        >
          Tra cứu lại
        </Link>
      </div>
    );
  }

  const bank = getBankAccountInfo();
  const qrUrl = buildVietQrUrl({ amount: order.totalAmount, orderCode: order.code });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Cảm ơn bạn đã đặt hàng!
        </h1>
        <p className="mt-1 text-ink/60">
          Mã đơn hàng của bạn:{" "}
          <span className="font-display text-lg font-extrabold text-bubblegum">{order.code}</span>
        </p>
        <div className="mt-3">
          <StatusBadge status={order.status as OrderStatusKey} />
        </div>
      </div>

      <div className="mt-8">
        <OrderProgress status={order.status as OrderStatusKey} />
      </div>

      {order.status === "PENDING_PAYMENT" && (
        <div className="card-sticker mt-8 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <div className="w-full max-w-[220px] overflow-hidden rounded-2xl border-4 border-lagoon-light sm:w-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="Mã QR thanh toán VietQR"
              width={220}
              height={220}
              className="h-auto w-full"
            />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              📱 Quét mã QR để thanh toán
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Mở app ngân hàng bất kỳ, quét mã QR, số tiền và nội dung sẽ tự điền sẵn.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <span className="font-bold text-ink/50">Chủ tài khoản:</span> {bank.accountName}
              </li>
              <li>
                <span className="font-bold text-ink/50">Số tài khoản:</span> {bank.accountNo}
              </li>
              <li>
                <span className="font-bold text-ink/50">Số tiền:</span>{" "}
                <span className="font-extrabold text-bubblegum">{formatVnd(order.totalAmount)}</span>
              </li>
              <li>
                <span className="font-bold text-ink/50">Nội dung:</span> Thanh toán đơn {order.code}
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="card-sticker mt-8 p-6">
        <h2 className="font-display text-lg font-bold text-ink">Chi tiết đơn hàng</h2>
        <ul className="mt-3 divide-y-2 divide-dashed divide-cream">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-ink/70">
                {item.productName} × {item.quantity}
              </span>
              <span className="font-bold text-ink">{formatVnd(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t-2 border-cream pt-3">
          <span className="font-bold text-ink/60">Tổng cộng</span>
          <span className="font-display text-xl font-extrabold text-bubblegum">
            {formatVnd(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="font-bold text-ink/50 hover:text-bubblegum">
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
