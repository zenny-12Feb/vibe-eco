import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  OrderStatusKey,
} from "@/lib/order-status";

export default function OrderProgress({ status }: { status: OrderStatusKey }) {
  if (status === "CANCELLED") {
    return (
      <div className="card-sticker flex items-center gap-3 border-bubblegum-light p-5">
        <span className="text-3xl">❌</span>
        <div>
          <p className="font-display text-lg font-bold text-bubblegum-dark">
            Đơn hàng đã bị hủy
          </p>
          <p className="text-sm text-ink/60">
            Liên hệ cửa hàng nếu bạn cần hỗ trợ thêm.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="card-sticker overflow-x-auto p-6">
      <div className="flex min-w-[560px] items-center">
        {ORDER_STATUS_FLOW.map((step, i) => {
          const meta = ORDER_STATUS_META[step];
          const done = i <= currentIndex;
          const isLast = i === ORDER_STATUS_FLOW.length - 1;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all ${
                    done
                      ? `${meta.bg} ${meta.color} scale-100 shadow-chunky-sm`
                      : "scale-90 bg-cream text-ink/30"
                  } ${i === currentIndex ? "animate-pop ring-4 ring-sunshine" : ""}`}
                >
                  {meta.emoji}
                </div>
                <span
                  className={`w-20 text-center text-xs font-bold ${
                    done ? "text-ink" : "text-ink/30"
                  }`}
                >
                  {meta.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-1 mb-6 h-1.5 flex-1 rounded-full ${
                    i < currentIndex ? "bg-grass" : "bg-cream"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
