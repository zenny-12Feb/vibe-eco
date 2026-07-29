"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith("/admin");
  const { totalItems } = useCart();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b-4 border-bubblegum-light bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:h-20 sm:flex-nowrap sm:py-0 sm:px-6">
        <Link href={isAdmin ? "/admin" : "/"} className="flex flex-wrap items-center gap-2 font-display text-2xl font-extrabold text-bubblegum">
          <span className="inline-block animate-wobble">🛍️</span>
          Bộp
          {isAdmin && (
            <span className="ml-1 rounded-full bg-berry-light px-3 py-1 text-xs font-bold text-berry-dark">
              ADMIN
            </span>
          )}
        </Link>

        {isAdmin ? (
          <nav className="flex flex-wrap items-center justify-end gap-1 sm:flex-nowrap sm:gap-2">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Sản phẩm</NavLink>
            <NavLink href="/admin/orders">Đơn hàng</NavLink>
            <NavLink href="/admin/pricing">Cấu hình giá</NavLink>
            <button
              onClick={handleLogout}
              className="btn-chunky bg-bubblegum px-4 py-2.5 text-sm text-white shadow-chunky-sm hover:bg-bubblegum-dark sm:py-2"
            >
              Đăng xuất
            </button>
          </nav>
        ) : (
          <nav className="flex flex-wrap items-center justify-end gap-1 sm:flex-nowrap sm:gap-4">
            <NavLink href="/">Trang chủ</NavLink>
            <NavLink href="/order/lookup">Tra cứu đơn</NavLink>
            <Link
              href="/cart"
              className="btn-chunky relative bg-sunshine px-4 py-2.5 text-sm text-ink shadow-chunky-sm hover:bg-sunshine-dark sm:py-2"
            >
              🛒 Giỏ hàng
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 animate-pop items-center justify-center rounded-full bg-bubblegum text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-2.5 text-sm font-bold transition-colors sm:px-4 sm:py-2 ${
        active ? "bg-lagoon-light text-lagoon-dark" : "text-ink/70 hover:bg-cream"
      }`}
    >
      {children}
    </Link>
  );
}
