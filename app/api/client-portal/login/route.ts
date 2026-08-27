import { NextResponse } from "next/server";
import {
  clientPortalCookie,
  clientPortalSessionSeconds,
  createClientPortalToken,
  isClientPortalConfigured,
  validClientPortalCredentials,
} from "@/lib/client-portal-auth";

export const runtime = "nodejs";

const loginWindowMs = 15 * 60 * 1000;
const loginMaximum = 8;
const attempts = new Map<string, number[]>();

function requestKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "local";
}

function isRateLimited(request: Request) {
  const key = requestKey(request);
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < loginWindowMs);
  attempts.set(key, recent);
  return recent.length >= loginMaximum;
}

function recordFailure(request: Request) {
  const key = requestKey(request);
  attempts.set(key, [...(attempts.get(key) ?? []), Date.now()]);
}

function trustedRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function loginRedirect(request: Request, error: string) {
  return NextResponse.redirect(new URL(`/client-login?error=${error}`, request.url), 303);
}

export async function POST(request: Request) {
  if (!trustedRequest(request)) return loginRedirect(request, "invalid");
  if (!isClientPortalConfigured()) return loginRedirect(request, "configuration");
  if (isRateLimited(request)) return loginRedirect(request, "limited");

  const formData = await request.formData();
  const accessId = String(formData.get("accessId") ?? "").trim().slice(0, 120);
  const password = String(formData.get("password") ?? "").slice(0, 256);
  if (!validClientPortalCredentials(accessId, password)) {
    recordFailure(request);
    return loginRedirect(request, "invalid");
  }

  attempts.delete(requestKey(request));
  const response = NextResponse.redirect(new URL("/client-portal", request.url), 303);
  response.cookies.set(clientPortalCookie, await createClientPortalToken(accessId), {
    httpOnly: true,
    secure: process.env.VERCEL === "1",
    sameSite: "strict",
    path: "/",
    maxAge: clientPortalSessionSeconds,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
