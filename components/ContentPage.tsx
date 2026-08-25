import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, ChevronRight, Phone } from "lucide-react";
import type { ContentAction, ContentCard, ContentPageData } from "@/app/content-data";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import { displayHeading } from "@/app/display-text";
import { BidForm } from "@/components/BidForm";
import { JZMedia } from "@/components/JZMedia";
import { ProjectGallery } from "@/components/ProjectGallery";
import { DivisionHeader, GroupHeader } from "@/components/SiteNavigation";
import { BreadcrumbStructuredData, ServiceStructuredData } from "@/components/StructuredData";
import { TeamGrid } from "@/components/TeamGrid";

function ActionLink({ action }: { action: ContentAction }) {
  const icon = action.label.toLowerCase().includes("download")
    ? <ArrowDownToLine aria-hidden="true" size={17} />
    : <ArrowUpRight aria-hidden="true" size={17} />;
  const content = <>{action.label}{icon}</>;

  if (action.external) return <a className="metric-button" href={action.href} target="_blank" rel="noreferrer">{content}</a>;
  return <Link className="metric-button" href={action.href}>{content}</Link>;
}

function BreakableLabel({ text }: { text: string }) {
  const atIndex = text.indexOf("@");
  if (atIndex === -1) return text;

  return <>{text.slice(0, atIndex + 1)}<wbr />{text.slice(atIndex + 1)}</>;
}

function LinkedCard({ card, index }: { card: ContentCard; index: number }) {
  const body = (
    <>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{displayHeading(card.title)}</h3>
        {card.subtitle ? <p className="metric-card-subtitle"><BreakableLabel text={card.subtitle} /></p> : null}
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
  const contactHref = data.division ? `/contact?for=${data.division}` : "/contact";
  const breadcrumb = data.division ? divisionLabels[data.division] : "JZ Group";
  const currentPath = data.division ? `/${data.division}/${data.path}` : `/${data.path}`;
  const breadcrumbItems = [
    { name: "JZ Group", path: "/" },
    ...(data.division ? [{ name: breadcrumb, path: `/${data.division}` }] : []),
    { name: data.title, path: currentPath },
  ];
  const serviceName = data.eyebrow.split(" / ").at(-1) ?? data.title;

  return (
    <main
      className={`content-page metric-content-page content-${data.division ?? "group"} content-${data.category}`}
      data-content-source={data.sourceUrl}
    >
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {data.category === "service" ? (
        <ServiceStructuredData
          name={serviceName}
          description={data.introduction}
          path={currentPath}
          division={data.division}
        />
      ) : null}
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
          <h1>{displayHeading(data.title)}</h1>
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

      {data.category === "projects" || data.category === "sector" ? (
        <p className="metric-record-note">
          Public examples are shown for qualification. Dates, references, and complete scope records are available through estimating, subject to client approval.
        </p>
      ) : null}

      <div className="metric-content-sections">
        {data.sections.map((section, sectionIndex) => (
          <section
            className={`metric-content-section tone-${section.tone ?? (sectionIndex % 2 ? "concrete" : "paper")}`}
            id={section.id}
            key={section.id}
          >
            <header>
              <h2>{displayHeading(section.title)}</h2>
            </header>

            {section.paragraphs?.length || section.bullets?.length ? (
              <div className="metric-content-body">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              </div>
            ) : null}

            {section.mediaLabel || section.media ? (
              <figure className="metric-content-media">
                <JZMedia asset={section.media} context="section" data={data} />
              </figure>
            ) : null}

            {section.layout === "project-grid" ? <ProjectGallery /> : null}

            {section.team?.length ? <TeamGrid members={section.team} /> : null}

            {section.cards?.length && section.layout !== "project-grid" ? (
              <div className="metric-content-card-grid">
                {section.cards.map((card, index) => <LinkedCard card={card} index={index} key={`${card.title}-${index}`} />)}
              </div>
            ) : null}

            {section.specifications?.length ? (
              <div className="metric-spec-grid">
                {section.specifications.map((spec, index) => (
                  <article key={spec.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{displayHeading(spec.title)}</h3>
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
            <h2>Common Questions</h2>
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
            <h2 id="content-form-title">Contact Estimating</h2>
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
            <h2 id="related-title">Related Services</h2>
          </header>
          <div>
            {data.related.map((item, index) => <LinkedCard card={item} index={index} key={`${item.title}-${index}`} />)}
          </div>
        </section>
      ) : null}

      <section className="metric-page-cta">
        <h2>Start a Project</h2>
        <Link href={contactHref}>Send project details <ArrowUpRight aria-hidden="true" size={22} /></Link>
      </section>

      <footer className="metric-subpage-footer">
        <div>
          <strong>{breadcrumb}</strong>
          <span>{contact ? `${contact.officeLabel}: ${contact.address}` : "JZ Group office: 15219 NW 60th Ave, Miami Lakes, Florida 33014"}</span>
        </div>
        <div><span>South Florida</span><a href="tel:+13057932984">(305) 793-2984</a></div>
        <div><Link href="/">JZ Group</Link><Link href={contactHref}>Contact</Link></div>
      </footer>
    </main>
  );
}
