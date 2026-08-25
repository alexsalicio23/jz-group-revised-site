"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import { companyNavigationHref, getActiveCompanySite, groupSiteUrl, localizeCompanyHref } from "@/app/company-sites";
import type { TemplateSlug } from "@/app/templates/template-data";
import { ExpertiseMenu } from "@/components/ExpertiseMenu";
import { NavigationMenu, type NavigationMenuItem } from "@/components/NavigationMenu";

const groupLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Prequalification", href: "/safety" },
  { label: "About", href: "/about" },
] as const;

const companyLinks: ReadonlyArray<{ label: string; slug: TemplateSlug }> = [
  { label: "JZ Demolition", slug: "demolition" },
  { label: "JZ Construction", slug: "construction" },
  { label: "JZ Waste Management", slug: "waste-management" },
  { label: "JZ Development", slug: "development" },
] as const;

const serviceLinks: readonly NavigationMenuItem[] = [
  { index: "01", label: "General Contracting", href: "/construction/services/general-contracting", description: "Preconstruction, project leadership and closeout" },
  { index: "02", label: "Demolition", href: "/demolition", description: "Specialty, selective, total and concrete scopes" },
  { index: "03", label: "Interior Trades", href: "/construction/services/subcontracting", description: "Framing, drywall, ceilings and supporting scopes" },
  { index: "04", label: "Site Logistics", href: "/waste-management", description: "Dumpsters, hauling, cleanup and temporary fencing" },
  { index: "05", label: "Development", href: "/development", description: "Acquisition, planning, oversight and operations" },
  { index: "06", label: "All Services", href: "/services", description: "Compare every JZ service lane in one place" },
] as const;

function useScrolledHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrolled;
}

function Brand({ href = "/#top" }: { href?: string }) {
  return (
    <Link className="brand" href={href} aria-label="JZ Group home">
      <Image src="/media/brand-logo.webp" alt="JZ Group" width={164} height={82} priority sizes="112px" />
    </Link>
  );
}

function PrimaryLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return <Link aria-current={current ? "page" : undefined} href={href}>{label}</Link>;
}

function MobileGroupNavigation() {
  return (
    <details className="mobile-menu">
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        <Link className="mobile-menu-featured" href="/services">Services <ArrowUpRight aria-hidden="true" size={17} /></Link>
        <details className="mobile-expertise-menu">
          <summary>Companies</summary>
          <div>{companyLinks.map((item) => <Link href={`/${item.slug}`} key={item.slug}>{item.label}</Link>)}</div>
        </details>
        {groupLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        <div className="mobile-menu-contact">
          <a href="tel:+13057932984"><Phone aria-hidden="true" size={16} />(305) 793-2984</a>
          <Link href="/contact">Send a scope <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </div>
      </nav>
    </details>
  );
}

export function GroupHeader() {
  const scrolled = useScrolledHeader();
  const pathname = usePathname();

  return (
    <header className="site-header" data-scrolled={scrolled ? "true" : "false"}>
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <ExpertiseMenu />
        <NavigationMenu className="services-menu" items={serviceLinks} label="Services" />
        {groupLinks.map((item) => <PrimaryLink href={item.href} key={item.href} label={item.label} pathname={pathname} />)}
      </nav>
      <div className="header-actions">
        <Link className="header-contact" href="/contact">Contact <ArrowUpRight aria-hidden="true" size={15} /></Link>
      </div>
      <MobileGroupNavigation />
    </header>
  );
}

function divisionLinks(division: TemplateSlug) {
  const base = `/${division}`;
  const links = [
    { label: "Overview", href: base },
    { label: "Services", href: `${base}#capabilities` },
  ];

  if (division !== "waste-management") links.push({ label: "Projects", href: `${base}/projects` });
  links.push({ label: "About", href: `${base}/about` });
  return links.map((item) => ({ ...item, href: localizeCompanyHref(division, item.href) }));
}

export function DivisionHeader({ division }: { division: TemplateSlug }) {
  const links = divisionLinks(division);
  const contact = divisionContacts[division];
  const scrolled = useScrolledHeader();
  const activeCompany = getActiveCompanySite();
  const groupHref = activeCompany ? groupSiteUrl : "/";

  return (
    <header className="template-header" data-scrolled={scrolled ? "true" : "false"}>
      <Link className="template-brand" href={groupHref} aria-label="Return to JZ Group">
        <Image src="/media/brand-logo.webp" alt="JZ Group" width={88} height={56} priority />
        <span><strong>{divisionLabels[division]}</strong><small>A JZ Group Company</small></span>
      </Link>
      <nav aria-label={`${divisionLabels[division]} navigation`}>
        {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        <details className="division-switcher">
          <summary>Other companies <ChevronDown aria-hidden="true" size={14} /></summary>
          <div>{companyLinks.filter((item) => item.slug !== division).map((item) => <Link href={companyNavigationHref(item.slug)} key={item.slug}>{item.label}</Link>)}</div>
        </details>
      </nav>
      <Link className="template-header-cta" href={`/contact?for=${division}`}>Contact <ArrowUpRight aria-hidden="true" size={15} /></Link>
      <details className="template-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label={`${divisionLabels[division]} mobile navigation`}>
          <Link href={groupHref}>JZ Group</Link>
          {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <details className="mobile-expertise-menu">
            <summary>Other companies</summary>
            <div>{companyLinks.filter((item) => item.slug !== division).map((item) => <Link href={companyNavigationHref(item.slug)} key={item.slug}>{item.label}</Link>)}</div>
          </details>
          <Link href={`/contact?for=${division}`}>Contact</Link>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </nav>
      </details>
    </header>
  );
}
