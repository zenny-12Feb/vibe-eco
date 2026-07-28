import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

// GET /api/orders/[code] - tra cuu don hang bang ma (cong khai)
export async function GET(
  _request: NextRequest,
  { params }: { params: { code: string } }
) {
  const order = await prisma.order.findUnique({
    where: { code: params.code.toUpperCase() },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "SHIPPING",
    "COMPLETED",
    "CANCELLED",
  ]),
});

// PATCH /api/orders/[code] - cap nhat trang thai don hang (chi admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = updateStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { code: params.code.toUpperCase() },
      data: { status: parsed.data.status },
      include: { items: true },
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
  }
}
