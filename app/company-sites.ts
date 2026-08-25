import type { TemplateSlug } from "@/app/templates/template-data";

export const groupSiteUrl = "https://www.jzgroupmiami.com";

export const companySiteUrls: Record<TemplateSlug, string> = {
  demolition: "https://jz-demolition-miami.vercel.app",
  construction: "https://jz-construction-miami.vercel.app",
  "waste-management": "https://jz-waste-management-miami.vercel.app",
  development: "https://jz-development-miami.vercel.app",
};

const configuredCompany = process.env.NEXT_PUBLIC_COMPANY_SITE;
const validCompanies = new Set<TemplateSlug>([
  "demolition",
  "construction",
  "waste-management",
  "development",
]);

export function getActiveCompanySite(): TemplateSlug | null {
  return configuredCompany && validCompanies.has(configuredCompany as TemplateSlug)
    ? configuredCompany as TemplateSlug
    : null;
}

export function isCompanySite(division?: TemplateSlug) {
  const activeCompany = getActiveCompanySite();
  return division ? activeCompany === division : activeCompany !== null;
}

export function localizeCompanyHref(division: TemplateSlug, href: string) {
  if (!isCompanySite(division)) return href;

  const prefix = `/${division}`;
  if (href === prefix) return "/";
  if (href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}#`)) {
    return href.slice(prefix.length) || "/";
  }
  return href;
}

export function companySiteHref(division: TemplateSlug, path = "") {
  const suffix = path && path !== "/" ? `/${path.replace(/^\/+/, "")}` : "";
  return `${companySiteUrls[division]}${suffix}`;
}

export function companyNavigationHref(division: TemplateSlug) {
  const activeCompany = getActiveCompanySite();
  if (!activeCompany) return `/${division}`;
  return activeCompany === division ? "/" : companySiteUrls[division];
}
