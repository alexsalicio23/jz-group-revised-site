import type { MetadataRoute } from "next";
import { publicContentRoutes } from "@/app/content-data";
import { getSiteUrl } from "@/app/site-url";
import { templateOrder } from "@/app/templates/template-data";
import { getActiveCompanySite } from "@/app/company-sites";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const policyRoutes = ["/privacy", "/terms", "/accessibility"] as const;
  const retiredRoutes = new Set([
    "/demolition/contact",
    "/construction/contact",
    "/waste-management/contact",
    "/development/contact",
    "/demolition/team",
    "/construction/team",
    "/waste-management/team",
  ]);
  const activeCompany = getActiveCompanySite();
  if (activeCompany) {
    const divisionRoutes = publicContentRoutes.filter((route) => route.startsWith(`/${activeCompany}/`));
    return [
      { url: base, changeFrequency: "monthly", priority: 1 },
      ...divisionRoutes.map((route) => ({
        url: `${base}${route.slice(activeCompany.length + 1)}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.8 },
      ...policyRoutes.map((route) => ({
        url: `${base}${route}`,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
    ];
  }
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...templateOrder.map((division) => ({
      url: `${base}/${division}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...publicContentRoutes.filter((route) => !retiredRoutes.has(route)).map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "monthly" as const,
      priority: route.split("/").length <= 2 ? 0.8 : 0.7,
    })),
    ...policyRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
