import Link from "next/link";
import { ArrowUpRight, ChevronRight, Download, Phone } from "lucide-react";
import type { ContentAction, ContentCard, ContentPageData } from "@/app/content-data";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import { BidForm } from "@/components/BidForm";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { DivisionHeader, GroupHeader } from "@/components/SiteNavigation";

function ActionLink({ action }: { action: ContentAction }) {
  const content = <>{action.label}{action.label.toLowerCase().includes("download") ? <Download aria-hidden="true" size={17} /> : <ArrowUpRight aria-hidden="true" size={17} />}</>;
  if (action.external) return <a className="button button-light" href={action.href} target="_blank" rel="noreferrer">{content}</a>;
  return <Link className="button button-light" href={action.href}>{content}</Link>;
}

function LinkedCard({ card, index }: { card: ContentCard; index: number }) {
  const inner = (
    <>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{card.title}</h3>
        {card.subtitle ? <p className="content-card-subtitle">{card.subtitle}</p> : null}
        {card.description ? <p>{card.description}</p> : null}
      </div>
      {card.href ? <ArrowUpRight aria-hidden="true" size={20} /> : null}
    </>
  );

  if (!card.href) return <article className="content-card">{inner}</article>;
  if (card.href.startsWith("mailto:")) return <a className="content-card is-linked" href={card.href}>{inner}</a>;
  return <Link className="content-card is-linked" href={card.href}>{inner}</Link>;
}

export function ContentPage({ data }: { data: ContentPageData }) {
  const contact = data.division ? divisionContacts[data.division] : null;
  const contactHref = data.division ? `/${data.division}/contact` : "/contact";
  const breadcrumb = data.division ? divisionLabels[data.division] : "JZ Group";

  return (
    <main
      className={`content-page content-${data.division ?? "group"} content-${data.category}`}
      data-content-source={data.sourceUrl}
    >
      {data.division ? <DivisionHeader division={data.division} /> : <GroupHeader />}

      <section className="content-hero" id="top">
        <div className="content-hero-copy">
          <nav className="content-breadcrumb" aria-label="Breadcrumb">
            <Link href={data.division ? `/${data.division}` : "/"}>{breadcrumb}</Link>
            <ChevronRight aria-hidden="true" size={14} />
            <span>{data.category}</span>
          </nav>
          <p className="template-kicker">{data.eyebrow}</p>
          <h1>{data.title}</h1>
          <p className="content-hero-introduction">{data.introduction}</p>
          <div className="content-hero-actions">
            {data.actions?.map((action) => <ActionLink action={action} key={action.href} />)}
            <Link className="content-hero-link" href={contactHref}>Discuss a project <ArrowUpRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
        <div className="content-hero-media">
          <MediaPlaceholder label={data.mediaLabel} dark />
        </div>
      </section>

      <nav className="content-jump-nav" aria-label="On this page">
        <span>On this page</span>
        {data.sections.map((section, index) => (
          <a href={`#${section.id}`} key={section.id}><small>{String(index + 1).padStart(2, "0")}</small>{section.title}</a>
        ))}
        {data.faqs?.length ? <a href="#questions"><small>{String(data.sections.length + 1).padStart(2, "0")}</small>Questions</a> : null}
      </nav>

      {data.stats?.length ? (
        <section className="content-stats" aria-label="Page facts">
          {data.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </section>
      ) : null}

      <div className="content-sections">
        {data.sections.map((section, sectionIndex) => (
          <section className={`content-section tone-${section.tone ?? (sectionIndex % 2 ? "concrete" : "paper")}`} id={section.id} key={section.id}>
            <div className="content-section-heading">
              <p className="template-kicker">{section.eyebrow ?? `${String(sectionIndex + 1).padStart(2, "0")} / ${data.category}`}</p>
              <h2>{section.title}</h2>
            </div>

            {section.paragraphs?.length || section.bullets?.length ? (
              <div className="content-section-body">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              </div>
            ) : null}

            {section.mediaLabel ? <div className="content-section-media"><MediaPlaceholder label={section.mediaLabel} ratio="wide" dark={section.tone === "ink"} /></div> : null}

            {section.cards?.length ? (
              <div className="content-card-grid">
                {section.cards.map((card, index) => <LinkedCard card={card} index={index} key={`${card.title}-${index}`} />)}
              </div>
            ) : null}

            {section.specifications?.length ? (
              <div className="content-spec-grid">
                {section.specifications.map((spec, index) => (
                  <article className="content-spec" key={spec.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{spec.title}</h3>
                    {spec.dimensions?.length ? <dl>{spec.dimensions.map((dimension) => <div key={dimension}><dt>Dimension</dt><dd>{dimension}</dd></div>)}</dl> : null}
                    <h4>Best used for</h4>
                    <ul>{spec.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
                    <Link href={contactHref}>Request this service <ArrowUpRight aria-hidden="true" size={16} /></Link>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      {data.faqs?.length ? (
        <section className="content-faq" id="questions">
          <div className="content-section-heading">
            <p className="template-kicker">Project questions</p>
            <h2>What reviewers usually need to know.</h2>
          </div>
          <div className="content-faq-list">
            {data.faqs.map((faq, index) => (
              <details key={faq.question}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<strong aria-hidden="true">+</strong></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {data.category === "contact" ? (
        <section className="content-form-section" aria-labelledby="content-form-title">
          <div>
            <p className="template-kicker">Project intake</p>
            <h2 id="content-form-title">Put the project in front of estimating.</h2>
            <p>Include the service lane, location, facility status, bid date, and the scope information currently available.</p>
            <div className="content-direct-contact">
              <a href="tel:+13057932984"><Phone aria-hidden="true" size={18} />(305) 793-2984</a>
              {contact ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <a href="mailto:estimating@jzdemo.com">estimating@jzdemo.com</a>}
            </div>
          </div>
          <BidForm defaultDivision={data.division} />
        </section>
      ) : null}

      {data.related?.length ? (
        <section className="content-related" aria-labelledby="related-title">
          <div className="content-section-heading">
            <p className="template-kicker">Continue the review</p>
            <h2 id="related-title">Related JZ capabilities.</h2>
          </div>
          <div className="content-related-grid">
            {data.related.map((item, index) => <LinkedCard card={item} index={index} key={`${item.title}-${index}`} />)}
          </div>
        </section>
      ) : null}

      <footer className="content-footer">
        <div><strong>{breadcrumb}</strong><span>{contact?.address ?? "15219 NW 60th Ave, Miami Lakes, Florida 33014"}</span></div>
        <div><span>South Florida</span><a href="tel:+13057932984">(305) 793-2984</a></div>
        <div><Link href="/">JZ Group</Link><Link href={contactHref}>Contact</Link></div>
      </footer>
    </main>
  );
}
