import { NextResponse } from "next/server";
import { clientPortalCookie } from "@/lib/client-portal-auth";

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  const origin = request.headers.get("origin");
  if ((fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") || (origin && origin !== new URL(request.url).origin)) {
    return new NextResponse(null, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const response = NextResponse.redirect(new URL("/client-login", request.url), 303);
  response.cookies.set(clientPortalCookie, "", {
    httpOnly: true,
    secure: process.env.VERCEL === "1",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
