import Link from "next/link";
import { GroupHeader } from "@/components/SiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";

type LegalSection = {
  title: string;
  paragraphs?: readonly React.ReactNode[];
  bullets?: readonly React.ReactNode[];
};

type LegalPageProps = {
  title: string;
  summary: string;
  updated: string;
  sections: readonly LegalSection[];
};

export function LegalPage({ title, summary, updated, sections }: LegalPageProps) {
  return (
    <main className="legal-page" id="top">
      <GroupHeader />
      <header className="legal-hero">
        <p>JZ Group website</p>
        <h1>{title}</h1>
        <div>
          <p>{summary}</p>
          <time dateTime="2026-08-27">Last updated {updated}</time>
        </div>
      </header>

      <div className="legal-layout">
        <nav aria-label={`${title} sections`}>
          <strong>On this page</strong>
          {sections.map((section, index) => (
            <a href={`#legal-${index + 1}`} key={section.title}>{section.title}</a>
          ))}
        </nav>
        <article>
          {sections.map((section, index) => (
            <section id={`legal-${index + 1}`} key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                {section.bullets?.length ? <ul>{section.bullets.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul> : null}
              </div>
            </section>
          ))}
        </article>
      </div>

      <section className="legal-contact" aria-labelledby="legal-contact-title">
        <h2 id="legal-contact-title">Questions or requests</h2>
        <p>Contact JZ Group at <a href="mailto:estimating@jzdemo.com">estimating@jzdemo.com</a>, call <a href="tel:+13057932984">(305) 793-2984</a>, or write to 14605 Harris Pl, Miami Lakes, FL 33014.</p>
        <Link href="/contact">Contact JZ Group</Link>
      </section>
      <SiteFooter subpage />
    </main>
  );
}
