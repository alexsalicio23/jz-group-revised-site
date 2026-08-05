import type { MetadataRoute } from "next";
import { publicContentRoutes } from "@/app/content-data";
import { getSiteUrl } from "@/app/site-url";
import { templateOrder } from "@/app/templates/template-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
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
