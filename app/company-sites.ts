import type { TemplateSlug } from "@/app/templates/template-data";
import { buildContactIntentHref, type ContactIntent } from "@/app/contact/contact-intent";

export function validateGroupSiteUrl(value: string | undefined) {
  const url = new URL(value?.trim() || "https://www.jzgroupmiami.com");
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_GROUP_SITE_URL must be an HTTPS origin without credentials, a path, query, or fragment.");
  }
  return url.origin;
}

export const groupSiteUrl = validateGroupSiteUrl(process.env.NEXT_PUBLIC_GROUP_SITE_URL);

export function groupContactHref(intent: ContactIntent) {
  return `${groupSiteUrl}${buildContactIntentHref(intent)}`;
}

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

  if (href.startsWith("/")) {
    const target = new URL(href, groupSiteUrl);
    const [targetDivision, ...targetPath] = target.pathname.split("/").filter(Boolean);
    if (validCompanies.has(targetDivision as TemplateSlug) && targetDivision !== division) {
      return `${companySiteHref(targetDivision as TemplateSlug, targetPath.join("/"))}${target.search}${target.hash}`;
    }
  }

  const prefix = `/${division}`;
  if (href === prefix) return "/";
  if (href.startsWith(`${prefix}#`)) {
    return `/${href.slice(prefix.length)}`;
  }
  if (href.startsWith(`${prefix}/`)) {
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
