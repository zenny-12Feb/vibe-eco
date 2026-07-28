"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuantityStepper from "./QuantityStepper";
import { useCart } from "@/lib/cart-context";
import { formatVnd } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export default function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/cart");
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-ink/50">Số lượng (còn {product.stock} sản phẩm)</p>
        <div className="mt-2">
          <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock || 1} />
        </div>
      </div>

      <div className="rounded-2xl bg-sunshine-light p-4">
        <p className="text-sm font-bold text-ink/60">Tạm tính</p>
        <p className="font-display text-2xl font-extrabold text-ink">
          {formatVnd(product.price * quantity)}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn-chunky flex-1 bg-lagoon px-6 py-3 text-white hover:bg-lagoon-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "✅ Đã thêm vào giỏ!" : "🛒 Thêm vào giỏ"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="btn-chunky flex-1 bg-bubblegum px-6 py-3 text-white hover:bg-bubblegum-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mua ngay ⚡
        </button>
      </div>
      {isOutOfStock && (
        <p className="text-center font-bold text-bubblegum-dark">Sản phẩm tạm hết hàng 😢</p>
      )}
    </div>
  );
}
