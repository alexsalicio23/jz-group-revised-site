import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { contact } from "@/app/data";
import { companyNavigationHref, getActiveCompanySite, groupSiteUrl } from "@/app/company-sites";
import type { TemplateSlug } from "@/app/templates/template-data";

type SiteFooterProps = {
  companyName?: string;
  email?: string;
  contactHref?: string;
  subpage?: boolean;
  division?: TemplateSlug;
};

const exploreLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Qualifications", href: "/safety" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const companyLinks: ReadonlyArray<{ label: string; slug: TemplateSlug }> = [
  { label: "JZ Demolition", slug: "demolition" },
  { label: "JZ Construction", slug: "construction" },
  { label: "JZ Waste Management", slug: "waste-management" },
  { label: "JZ Development", slug: "development" },
] as const;

export function SiteFooter({
  companyName = "JZ Group",
  email = contact.email,
  contactHref = "/contact",
  subpage = false,
  division,
}: SiteFooterProps) {
  const activeCompany = getActiveCompanySite();
  const logoHref = activeCompany ? groupSiteUrl : "/";
  const localizedExploreLinks = division
    ? [
        { label: "Overview", href: "/" },
        { label: "Services", href: "/#capabilities" },
        ...(division === "waste-management" ? [] : [{ label: "Projects", href: "/projects" }]),
        { label: "About", href: "/about" },
        { label: "Qualifications", href: `${groupSiteUrl}/safety` },
        { label: "Contact", href: `/contact?for=${division}` },
      ]
    : exploreLinks;

  return (
    <footer className={`jz-site-footer metric-footer${subpage ? " metric-subpage-footer" : ""}`}>
      <div className="jz-site-footer-brand">
        <Link className="jz-site-footer-logo" href={logoHref} aria-label="JZ Group">
          <Image src="/media/brand-logo.webp" alt="" width={220} height={110} />
        </Link>
        <p>{companyName === "JZ Group" ? "Four coordinated companies serving projects across Florida." : `${companyName} is a JZ Group company.`}</p>
        <Link href={contactHref}>Start a project <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
      <nav aria-label="Explore JZ Group">
        <strong>Explore</strong>
        {localizedExploreLinks.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}
      </nav>
      <nav aria-label="JZ Group companies">
        <strong>Companies</strong>
        {companyLinks.map((item) => <Link href={companyNavigationHref(item.slug)} key={item.slug}>{item.label}</Link>)}
      </nav>
      <div className="jz-site-footer-contact">
        <strong>Contact</strong>
        <a href={contact.phoneHref}><Phone aria-hidden="true" size={15} />{contact.phoneDisplay}</a>
        <a href={`mailto:${email}`}>{email}</a>
        <span>{contact.address}</span>
        <span>Statewide Florida</span>
      </div>
    </footer>
  );
}
