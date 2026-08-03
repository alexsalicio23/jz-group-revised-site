import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jz-group-redesign-v2.vercel.app";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/divisions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/active-facilities`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/safety`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.8 },
    ...["demolition", "construction", "waste-management", "development"].map((slug) => ({ url: `${base}/divisions/${slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...["baptist-medical-arts-4th-floor", "broward-mob-pompano", "workforce-housing-development"].map((slug) => ({ url: `${base}/projects/${slug}`, changeFrequency: "monthly" as const, priority: 0.65 })),
  ];
}
