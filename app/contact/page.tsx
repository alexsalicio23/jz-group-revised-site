import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { groupPages } from "@/app/content-data";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import { getActiveCompanySite } from "@/app/company-sites";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";
import { ContactHandoff } from "@/components/ContactHandoff";
import { DivisionHeader } from "@/components/SiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";

const data = groupPages.contact;
const activeCompany = getActiveCompanySite();
const pageData = activeCompany
  ? {
      ...data,
      division: activeCompany,
      eyebrow: `${divisionLabels[activeCompany]} / Contact`,
      title: `Contact ${divisionLabels[activeCompany]}`,
      introduction: `${divisionLabels[activeCompany]} inquiries are handled through JZ Group. Continue to the group website to contact the right team.`,
    }
  : data;

export const metadata: Metadata = buildPageMetadata({
  title: activeCompany ? `Contact ${divisionLabels[activeCompany]} Estimating` : data.seoTitle ?? "Contact Estimating | JZ Group",
  description: pageData.introduction,
  path: "/contact",
  image: "/media/website-photos/construction-plan-review.webp",
  imageAlt: "JZ construction professional reviewing project plans",
});

export default function ContactPage() {
  if (activeCompany) {
    const contact = divisionContacts[activeCompany];
    const companyName = divisionLabels[activeCompany];
    return (
      <main className={`content-page metric-content-page content-${activeCompany} content-contact company-contact-page`}>
        <DivisionHeader division={activeCompany} />
        <section className="metric-content-hero" id="top">
          <div className="metric-content-hero-media">
            <Image src="/media/jzg/project-100-biscayne.webp" alt="A JZ team member reviewing project drawings" fill priority sizes="100vw" />
          </div>
          <div className="metric-content-hero-shade" />
          <div className="metric-content-hero-copy">
            <nav className="metric-breadcrumb" aria-label="Breadcrumb"><Link href="/">{companyName}</Link><ChevronRight aria-hidden="true" size={13} /><span>Contact</span></nav>
            <h1>{pageData.title}</h1>
            <div className="metric-content-hero-bottom"><p>{pageData.introduction}</p><a className="metric-hero-link" href="#contact-handoff">Contact the team <ChevronRight aria-hidden="true" size={17} /></a></div>
          </div>
        </section>
        <section className="metric-content-form" id="contact-handoff" aria-label={`Contact ${companyName}`}>
          <div>
            <h2>{companyName}</h2>
            <div className="metric-direct-contact">
              <a href="tel:+13057932984"><Phone aria-hidden="true" size={18} />(305) 793-2984</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
          <ContactHandoff division={activeCompany} />
        </section>
        <SiteFooter companyName={companyName} division={activeCompany} contactHref={`/contact?for=${activeCompany}`} email={contact.email} subpage />
      </main>
    );
  }
  return <ContentPage data={pageData} />;
}
