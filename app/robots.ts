import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/app/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const preview = process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_NO_INDEX === "1";

  if (preview) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
