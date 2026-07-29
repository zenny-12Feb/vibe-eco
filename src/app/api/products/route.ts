import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

// GET /api/products - danh sach san pham dang ban (cong khai)
// ?all=1 (chi admin) tra ve ca san pham an
export async function GET(request: NextRequest) {
  const all = request.nextUrl.searchParams.get("all") === "1";

  if (all) {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ products });
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.number().int().nonnegative(),
  costPrice: z.number().int().nonnegative().default(0),
  imageUrl: z.string().default(""),
  category: z.string().default("Khác"),
  stock: z.number().int().nonnegative().default(100),
  itemsPerBlock: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
});

// POST /api/products - tao san pham moi (chi admin)
export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = createProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json({ product }, { status: 201 });
}
