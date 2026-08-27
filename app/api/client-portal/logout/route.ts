import { NextResponse } from "next/server";
import { clientPortalCookie } from "@/lib/client-portal-auth";

export async function POST(request: Request) {
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
