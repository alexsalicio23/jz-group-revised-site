import { getSiteUrl } from "@/app/site-url";

export const dynamic = "force-static";

export function GET() {
  const base = getSiteUrl();
  const body = [
    "Contact: mailto:estimating@jzdemo.com?subject=Website%20security%20report",
    `Canonical: ${base}/.well-known/security.txt`,
    `Policy: ${base}/privacy`,
    "Preferred-Languages: en",
    "Expires: 2027-08-27T23:59:59Z",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
