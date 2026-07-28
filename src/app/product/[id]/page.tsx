import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailActions from "@/components/ProductDetailActions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 font-bold text-ink/60 hover:text-bubblegum">
        ← Ve trang chu
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="card-sticker overflow-hidden p-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-cream">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-7xl">🎁</div>
            )}
          </div>
        </div>

        <div>
          <span className="rounded-full bg-lagoon-light px-3 py-1 text-xs font-bold text-lagoon-dark">
            {product.category}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">{product.name}</h1>
          <p className="mt-3 text-ink/70">{product.description}</p>

          <div className="mt-6">
            <ProductDetailActions
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
