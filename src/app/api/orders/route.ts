import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { generateOrderCode } from "@/lib/order-code";

// GET /api/orders - danh sach don hang (chi admin), loc theo status neu co
export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Khong co quyen truy cap" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Vui long nhap ten"),
  customerPhone: z.string().min(8, "So dien thoai khong hop le"),
  customerAddress: z.string().default(""),
  note: z.string().default(""),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Gio hang dang trong"),
});

// POST /api/orders - tao don hang moi (khach - guest)
export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createOrderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { customerName, customerPhone, customerAddress, note, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Mot so san pham khong con ton tai hoac da ngung ban" },
      { status: 400 }
    );
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `San pham "${product.name}" khong du hang (con ${product.stock})` },
        { status: 400 }
      );
    }
  }

  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const totalAmount = orderItemsData.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // Thu toi da 5 lan de tranh trung ma don hang
  let order;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateOrderCode();
    try {
      order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            code,
            customerName,
            customerPhone,
            customerAddress,
            note,
            totalAmount,
            items: { create: orderItemsData },
          },
          include: { items: true },
        });

        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        return created;
      });
      break;
    } catch (err: any) {
      if (err?.code === "P2002") continue; // trung ma, thu lai
      throw err;
    }
  }

  if (!order) {
    return NextResponse.json({ error: "Khong the tao don hang, vui long thu lai" }, { status: 500 });
  }

  return NextResponse.json({ order }, { status: 201 });
}
