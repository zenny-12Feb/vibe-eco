import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "vibe_eco_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 gio

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || "dev-only-insecure-secret";
  return new TextEncoder().encode(secret);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;
  return admin;
}

export async function createSessionCookie(adminId: string, username: string) {
  const token = await new SignJWT({ sub: adminId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function destroySessionCookie() {
  cookies().set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function getSessionFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { sub: string; username: string };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return getSessionFromToken(token);
}
