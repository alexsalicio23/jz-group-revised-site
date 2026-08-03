import type { MetadataRoute } from "next";
import { publicContentRoutes } from "@/app/content-data";
import { templateOrder } from "@/app/templates/template-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jz-group-redesign-v2.vercel.app";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...templateOrder.map((division) => ({
      url: `${base}/${division}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...publicContentRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "monthly" as const,
      priority: route.split("/").length <= 2 ? 0.8 : 0.7,
    })),
  ];
}
