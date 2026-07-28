import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().nonnegative().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = updateProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }
}
