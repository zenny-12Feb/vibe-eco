import { NextResponse } from "next/server";
import { destroySessionCookie } from "@/lib/auth";

export async function POST() {
  destroySessionCookie();
  return NextResponse.json({ ok: true });
}
