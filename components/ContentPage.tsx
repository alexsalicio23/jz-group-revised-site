import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, ChevronRight, Phone } from "lucide-react";
import type { ContentAction, ContentCard, ContentPageData } from "@/app/content-data";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import { BidForm } from "@/components/BidForm";
import { JZMedia } from "@/components/JZMedia";
import { DivisionHeader, GroupHeader } from "@/components/SiteNavigation";

function ActionLink({ action }: { action: ContentAction }) {
  const icon = action.label.toLowerCase().includes("download")
    ? <ArrowDownToLine aria-hidden="true" size={17} />
    : <ArrowUpRight aria-hidden="true" size={17} />;
  const content = <>{action.label}{icon}</>;

  if (action.external) return <a className="metric-button" href={action.href} target="_blank" rel="noreferrer">{content}</a>;
  return <Link className="metric-button" href={action.href}>{content}</Link>;
}

function LinkedCard({ card, index }: { card: ContentCard; index: number }) {
  const body = (
    <>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{card.title}</h3>
        {card.subtitle ? <p className="metric-card-subtitle">{card.subtitle}</p> : null}
        {card.description ? <p>{card.description}</p> : null}
      </div>
      {card.href ? <ArrowUpRight aria-hidden="true" size={21} /> : null}
    </>
  );

  if (!card.href) return <article className="metric-content-card">{body}</article>;
  if (card.href.startsWith("mailto:")) return <a className="metric-content-card is-linked" href={card.href}>{body}</a>;
  return <Link className="metric-content-card is-linked" href={card.href}>{body}</Link>;
}

export function ContentPage({ data }: { data: ContentPageData }) {
  const contact = data.division ? divisionContacts[data.division] : null;
  const contactHref = data.division ? `/${data.division}/contact` : "/contact";
  const breadcrumb = data.division ? divisionLabels[data.division] : "JZ Group";

  return (
    <main
      className={`content-page metric-content-page content-${data.division ?? "group"} content-${data.category}`}
      data-content-source={data.sourceUrl}
    >
      {data.division ? <DivisionHeader division={data.division} /> : <GroupHeader />}

      <section className="metric-content-hero" id="top">
        <div className="metric-content-hero-media">
          <JZMedia data={data} motion={Boolean(data.division)} priority />
        </div>
        <div className="metric-content-hero-shade" />
        <div className="metric-content-hero-copy">
          <nav className="metric-breadcrumb" aria-label="Breadcrumb">
            <Link href={data.division ? `/${data.division}` : "/"}>{breadcrumb}</Link>
            <ChevronRight aria-hidden="true" size={13} />
            <span>{data.category}</span>
          </nav>
          <p>{data.eyebrow}</p>
          <h1>{data.title}</h1>
          <div className="metric-content-hero-bottom">
            <p>{data.introduction}</p>
            <div>
              {data.actions?.map((action) => <ActionLink action={action} key={action.href} />)}
              <Link className="metric-hero-link" href={contactHref}>Discuss a project <ArrowUpRight aria-hidden="true" size={17} /></Link>
            </div>
          </div>
        </div>
      </section>

      {data.stats?.length ? (
        <section className="metric-content-stats" aria-label="Page facts">
          {data.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </section>
      ) : null}

      <div className="metric-content-sections">
        {data.sections.map((section, sectionIndex) => (
          <section
            className={`metric-content-section tone-${section.tone ?? (sectionIndex % 2 ? "concrete" : "paper")}`}
            id={section.id}
            key={section.id}
          >
            <header>
              <p className="section-index">{String(sectionIndex + 1).padStart(2, "0")} / {section.eyebrow ?? data.category}</p>
              <h2>{section.title}</h2>
            </header>

            {section.paragraphs?.length || section.bullets?.length ? (
              <div className="metric-content-body">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              </div>
            ) : null}

            {section.mediaLabel ? (
              <figure className="metric-content-media">
                <JZMedia data={data} mediaLabel={section.mediaLabel} />
              </figure>
            ) : null}

            {section.cards?.length ? (
              <div className="metric-content-card-grid">
                {section.cards.map((card, index) => <LinkedCard card={card} index={index} key={`${card.title}-${index}`} />)}
              </div>
            ) : null}

            {section.specifications?.length ? (
              <div className="metric-spec-grid">
                {section.specifications.map((spec, index) => (
                  <article key={spec.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{spec.title}</h3>
                    {spec.dimensions?.length ? <p>{spec.dimensions.join(" / ")}</p> : null}
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
        <section className="metric-faq" id="questions">
          <header>
            <p className="section-index">Questions / Project review</p>
            <h2>What reviewers usually need to know.</h2>
          </header>
          <div>
            {data.faqs.map((faq, index) => (
              <details key={faq.question}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {data.category === "contact" ? (
        <section className="metric-content-form" aria-labelledby="content-form-title">
          <div>
            <p className="section-index">Project intake / South Florida</p>
            <h2 id="content-form-title">Put the project in front of estimating.</h2>
            <p>Include the service lane, location, facility status, bid date, and the scope information currently available.</p>
            <div className="metric-direct-contact">
              <a href="tel:+13057932984"><Phone aria-hidden="true" size={18} />(305) 793-2984</a>
              <a href={`mailto:${contact?.email ?? "estimating@jzdemo.com"}`}>{contact?.email ?? "estimating@jzdemo.com"}</a>
            </div>
          </div>
          <BidForm defaultDivision={data.division} />
        </section>
      ) : null}

      {data.related?.length ? (
        <section className="metric-related" aria-labelledby="related-title">
          <header>
            <p className="section-index">Continue the review</p>
            <h2 id="related-title">Related JZ capabilities.</h2>
          </header>
          <div>
            {data.related.map((item, index) => <LinkedCard card={item} index={index} key={`${item.title}-${index}`} />)}
          </div>
        </section>
      ) : null}

      <section className="metric-page-cta">
        <p>Have a scope?</p>
        <h2>Let&apos;s put the right JZ company behind it.</h2>
        <Link href={contactHref}>Send project details <ArrowUpRight aria-hidden="true" size={22} /></Link>
      </section>

      <footer className="metric-subpage-footer">
        <div><strong>{breadcrumb}</strong><span>{contact?.address ?? "15219 NW 60th Ave, Miami Lakes, Florida 33014"}</span></div>
        <div><span>South Florida</span><a href="tel:+13057932984">(305) 793-2984</a></div>
        <div><Link href="/">JZ Group</Link><Link href={contactHref}>Contact</Link></div>
      </footer>
    </main>
  );
}
