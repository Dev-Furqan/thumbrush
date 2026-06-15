import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const cookieName = "thumbrush_admin";
const maxAge = 60 * 60 * 8;

function getSecret() {
  return process.env.AUTH_SECRET || "local-dev-secret-change-before-production";
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(email: string) {
  const expires = Date.now() + maxAge * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expires })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) return false;
  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return false;

  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  if (!payload || !signature || !timingSafeEqual(signature, sign(payload))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      expires?: number;
    };

    return typeof session.email === "string" && typeof session.expires === "number" && session.expires >= Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifySessionToken(store.get(cookieName)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession(email: string) {
  const store = await cookies();
  store.set(cookieName, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export function validateAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL || "admin@thumbrush.local";
  const expectedPassword = process.env.ADMIN_PASSWORD || "change-this-password";

  return timingSafeEqual(email, expectedEmail) && timingSafeEqual(password, expectedPassword);
}
