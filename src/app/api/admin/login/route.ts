import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminCredentials, createSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Thieu thong tin dang nhap" }, { status: 400 });
  }

  const admin = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!admin) {
    return NextResponse.json({ error: "Sai ten dang nhap hoac mat khau" }, { status: 401 });
  }

  await createSessionCookie(admin.id, admin.username);
  return NextResponse.json({ ok: true });
}
