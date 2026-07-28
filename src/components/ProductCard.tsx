"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatVnd } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];

  function handleQuickAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      1
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div
      className={`card-sticker group relative flex flex-col overflow-hidden p-3 hover:rotate-0 hover:scale-[1.03] ${rotation}`}
    >
      {product.stock <= 0 && (
        <span className="absolute left-5 top-5 z-10 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
          Hết hàng
        </span>
      )}
      <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-[1.5rem]">
        <div className="relative aspect-square w-full bg-cream">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">🎁</div>
          )}
        </div>
      </Link>

      <span className="mt-3 w-fit rounded-full bg-lagoon-light px-3 py-0.5 text-xs font-bold text-lagoon-dark">
        {product.category}
      </span>

      <Link href={`/product/${product.id}`}>
        <h3 className="mt-2 line-clamp-1 font-display text-lg font-bold text-ink">
          {product.name}
        </h3>
      </Link>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-display text-xl font-extrabold text-bubblegum">
          {formatVnd(product.price)}
        </span>
        <button
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          className="btn-chunky h-10 w-10 shrink-0 bg-grass text-lg text-white shadow-chunky-sm hover:bg-grass-dark disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Thêm ${product.name} vào giỏ`}
          title="Thêm vào giỏ"
        >
          {justAdded ? "✅" : "+"}
        </button>
      </div>
    </div>
  );
}
