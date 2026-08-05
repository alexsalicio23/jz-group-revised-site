import Image from "next/image";
import Link from "next/link";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import type { TemplateSlug } from "@/app/templates/template-data";

const groupLinks = [
  { label: "Companies", href: "/#group" },
  { label: "Projects", href: "/projects" },
  { label: "Safety", href: "/safety" },
  { label: "About", href: "/about" },
];

export function GroupHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label="JZ Group home">
        <Image src="/media/brand-logo.webp" alt="JZ Group" width={164} height={82} priority sizes="132px" />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {groupLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
      <Link className="header-contact" href="/contact">Start a bid conversation</Link>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          {groupLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href="/contact">Contact estimating</Link>
        </nav>
      </details>
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
  if (division !== "development") links.push({ label: "Team", href: `${base}/team` });
  return links;
}

export function DivisionHeader({ division }: { division: TemplateSlug }) {
  const links = divisionLinks(division);
  const contact = divisionContacts[division];

  return (
    <header className="template-header">
      <Link className="template-brand" href="/" aria-label="Return to JZ Group">
        <Image src="/media/brand-logo.webp" alt="JZ Group" width={72} height={72} priority />
        <span><strong>{divisionLabels[division]}</strong><small>A JZ Group company</small></span>
      </Link>
      <nav aria-label={`${divisionLabels[division]} navigation`}>
        {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
      <Link className="template-header-cta" href={`/${division}/contact`}>Send a scope</Link>
      <details className="template-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label={`${divisionLabels[division]} mobile navigation`}>
          {links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href={`/${division}/contact`}>Contact</Link>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </nav>
      </details>
    </header>
  );
}
