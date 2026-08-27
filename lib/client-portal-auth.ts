import "server-only";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export const clientPortalCookie = "jz_client_session";
export const clientPortalSessionSeconds = 60 * 60 * 12;

function encodedSecret() {
  const secret = process.env.CLIENT_PORTAL_SECRET?.trim();
  return secret && secret.length >= 32 ? new TextEncoder().encode(secret) : null;
}

function constantTimeMatch(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export function isClientPortalConfigured() {
  return Boolean(
    process.env.CLIENT_PORTAL_ACCESS_ID?.trim()
    && process.env.CLIENT_PORTAL_PASSWORD?.trim()
    && encodedSecret(),
  );
}

export function validClientPortalCredentials(accessId: string, password: string) {
  const expectedAccessId = process.env.CLIENT_PORTAL_ACCESS_ID?.trim();
  const expectedPassword = process.env.CLIENT_PORTAL_PASSWORD?.trim();
  if (!expectedAccessId || !expectedPassword || !encodedSecret()) return false;

  return constantTimeMatch(accessId.trim().toLowerCase(), expectedAccessId.toLowerCase())
    && constantTimeMatch(password, expectedPassword);
}

export async function createClientPortalToken(accessId: string) {
  const secret = encodedSecret();
  if (!secret) throw new Error("Client portal secret is not configured.");

  return new SignJWT({ accessId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("jz-client")
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${clientPortalSessionSeconds}s`)
    .setIssuer("jzgroupmiami.com")
    .setAudience("jz-client-portal")
    .sign(secret);
}

export async function verifyClientPortalToken(token?: string) {
  const secret = encodedSecret();
  if (!token || !secret) return false;

  try {
    await jwtVerify(token, secret, {
      issuer: "jzgroupmiami.com",
      audience: "jz-client-portal",
      subject: "jz-client",
    });
    return true;
  } catch {
    return false;
  }
}

export async function hasClientPortalSession() {
  const cookieStore = await cookies();
  return verifyClientPortalToken(cookieStore.get(clientPortalCookie)?.value);
}
