import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="relative overflow-hidden">
      {/* Blob trang tri nen */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sunshine-light blur-2xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-lagoon-light blur-2xl" />

      <section className="relative mx-auto max-w-6xl px-4 pb-8 pt-14 text-center sm:px-6">
        <span className="inline-block animate-float text-6xl">🎈🧸🚀</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-ink sm:text-5xl">
          Cua hang <span className="text-bubblegum">vui nhon</span> cho be!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-ink/70">
          Chon mon do yeu thich, them vao gio, thanh toan that nhanh bang QR nhe!
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink/70 shadow-chunky-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="card-sticker mx-auto max-w-md p-10 text-center">
            <p className="text-5xl">📭</p>
            <p className="mt-3 font-display text-lg font-bold text-ink">
              Chua co san pham nao ca!
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Vao trang Admin de them san pham dau tien nhe.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
