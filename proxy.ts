import { NextResponse } from "next/server";

export function proxy() {
  const response = NextResponse.next();

  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");

  return response;
}

export const config = {
  matcher: ["/client-login", "/client-portal/:path*"],
};
