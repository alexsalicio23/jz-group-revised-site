import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import type { TemplateSlug } from "@/app/templates/template-data";
import { ExpertiseMenu } from "@/components/ExpertiseMenu";

const groupLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Safety", href: "/safety" },
  { label: "About", href: "/about" },
];

const mobileExpertiseLinks = [
  { label: "JZ Demolition", href: "/demolition" },
  { label: "JZ Construction", href: "/construction" },
  { label: "JZ Waste Management", href: "/waste-management" },
  { label: "JZ Development", href: "/development" },
];

function Brand({ href = "/#top" }: { href?: string }) {
  return (
    <Link className="brand" href={href} aria-label="JZ Group home">
      <Image src="/media/brand-logo.webp" alt="JZ Group" width={164} height={82} priority sizes="112px" />
    </Link>
  );
}

export function GroupHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <ExpertiseMenu />
        {groupLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
      <div className="header-actions">
        <a className="header-phone" href="tel:+13057932984"><Phone aria-hidden="true" size={14} />(305) 793-2984</a>
        <Link className="header-contact" href="/contact">Send a scope <ArrowUpRight aria-hidden="true" size={15} /></Link>
      </div>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <details className="mobile-expertise-menu">
            <summary>Companies</summary>
            <div>
              {mobileExpertiseLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </div>
          </details>
          {groupLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <a href="tel:+13057932984">(305) 793-2984</a>
          <Link href="/contact">Send a scope</Link>
        </nav>
      </details>
    </header>
  );
}

function divisionLinks(division: TemplateSlug) {
  const base = `/${division}`;
  const links = [
    { label: "Overview", href: base },
    { label: "Capabilities", href: `${base}#capabilities` },
  ];

  if (division !== "waste-management") links.push({ label: "Projects", href: `${base}/projects` });
  links.push({ label: "About", href: `${base}/about` });
  // One leadership group, presented once, on /about.
  links.push({ label: "Leadership", href: "/about#leadership" });
  return links;
}

export function DivisionHeader({ division }: { division: TemplateSlug }) {
  const links = divisionLinks(division);
  const contact = divisionContacts[division];

  return (
    <header className="template-header">
      <Link className="template-brand" href="/" aria-label="Return to JZ Group">
        <Image src="/media/brand-logo.webp" alt="JZ Group" width={88} height={56} priority />
        <span><strong>{divisionLabels[division]}</strong><small>A JZ Group Company</small></span>
      </Link>
      <nav aria-label={`${divisionLabels[division]} navigation`}>
        {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
      <Link className="template-header-cta" href={`/contact?for=${division}`}>Send a scope <ArrowUpRight aria-hidden="true" size={15} /></Link>
      <details className="template-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label={`${divisionLabels[division]} mobile navigation`}>
          {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href={`/contact?for=${division}`}>Contact</Link>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </nav>
      </details>
    </header>
  );
}
