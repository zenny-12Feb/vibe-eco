import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";

const baloo = Baloo_2({
  subsets: ["latin", "vietnamese"],
  variable: "--font-baloo",
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bộp - Cửa hàng vui nhộn",
  description: "Website bán hàng đơn giản, thân thiện với màu sắc tươi vui.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${baloo.variable} ${nunito.variable} font-body antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-80px)]">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
