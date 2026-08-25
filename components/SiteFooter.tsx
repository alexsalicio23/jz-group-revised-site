import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { contact } from "@/app/data";

type SiteFooterProps = {
  companyName?: string;
  email?: string;
  contactHref?: string;
  subpage?: boolean;
};

const exploreLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Qualifications", href: "/safety" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const companyLinks = [
  { label: "JZ Demolition", href: "/demolition" },
  { label: "JZ Construction", href: "/construction" },
  { label: "JZ Waste Management", href: "/waste-management" },
  { label: "JZ Development", href: "/development" },
] as const;

export function SiteFooter({
  companyName = "JZ Group",
  email = contact.email,
  contactHref = "/contact",
  subpage = false,
}: SiteFooterProps) {
  return (
    <footer className={`jz-site-footer metric-footer${subpage ? " metric-subpage-footer" : ""}`}>
      <div className="jz-site-footer-brand">
        <Link className="jz-site-footer-logo" href="/" aria-label="JZ Group">
          <Image src="/media/brand-logo.webp" alt="" width={220} height={110} />
        </Link>
        <p>{companyName === "JZ Group" ? "Four coordinated companies serving projects across Florida." : `${companyName} is a JZ Group company.`}</p>
        <Link href={contactHref}>Start a project <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
      <nav aria-label="Explore JZ Group">
        <strong>Explore</strong>
        {exploreLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
      <nav aria-label="JZ Group companies">
        <strong>Companies</strong>
        {companyLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
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
