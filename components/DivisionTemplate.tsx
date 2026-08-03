import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { divisionContacts } from "@/app/content-data";
import type { DivisionTemplateData } from "@/app/templates/template-data";
import { DivisionHeader } from "@/components/SiteNavigation";

const phoneDisplay = "(305) 793-2984";
const phoneHref = "tel:+13057932984";

function HeroMedia({ data }: { data: DivisionTemplateData }) {
  if (data.hero.type === "triptych" && data.hero.triptych) {
    return (
      <div className="template-triptych" aria-hidden="true">
        {data.hero.triptych.map((item, index) => (
          <div className="template-triptych-panel" key={item.media}>
            <video autoPlay muted loop playsInline preload={index === 0 ? "auto" : "metadata"} poster={item.poster}>
              <source src={item.media} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    );
  }

  return (
    <video className="template-hero-video" autoPlay muted loop playsInline preload="auto" poster={data.hero.poster} aria-hidden="true">
      {data.hero.mobileMedia ? <source src={data.hero.mobileMedia} type="video/mp4" media="(max-width: 760px)" /> : null}
      <source src={data.hero.media} type="video/mp4" />
    </video>
  );
}

function TemplateContact({ data }: { data: DivisionTemplateData }) {
  const emailSubject = encodeURIComponent(`${data.name} project inquiry`);
  const contact = divisionContacts[data.slug];
  return (
    <section className="template-contact" id="contact">
      <div>
        <p className="template-kicker">Estimating / South Florida</p>
        <h2>{data.close}</h2>
      </div>
      <div className="template-contact-actions">
        <a className="button button-light" href={`mailto:${data.email}?subject=${emailSubject}`}>Email estimating</a>
        <a href={phoneHref}>{phoneDisplay}</a>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </div>
      <footer>
        <span>Miami-Dade / Broward / Palm Beach</span>
        <span>{contact.address}</span>
        <Link href="/">Return to JZ Group</Link>
      </footer>
    </section>
  );
}

function DemolitionSite({ data }: { data: DivisionTemplateData }) {
  const emailSubject = encodeURIComponent(`${data.name} project inquiry`);
  return (
    <main className="division-template template-demolition demolition-site">
      <DivisionHeader division={data.slug} />
      <section className="template-hero" id="top">
        <div className="template-hero-media"><HeroMedia data={data} /></div>
        <div className="template-hero-shade" />
        <div className="template-hero-copy">
          <p className="template-kicker">{data.discipline}</p>
          <h1>{data.headline}</h1>
          <p className="template-introduction">{data.introduction}</p>
          <div className="template-actions">
            <a className="button button-light" href="#proof">View relevant proof</a>
            <a className="template-inline-link" href={`mailto:${data.email}?subject=${emailSubject}`}>Contact estimating <ArrowUpRight aria-hidden="true" size={17} /></a>
          </div>
        </div>
        <a className="template-scroll" href="#capabilities" aria-label="Continue to capabilities"><span>Explore</span><ArrowDown aria-hidden="true" size={18} /></a>
      </section>

      <section className="template-proof-rail" aria-label={`${data.name} project facts`}>
        <p><span>{data.index}</span>{data.name}</p>
        <dl>{data.proof.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </section>

      <section className="template-capabilities" id="capabilities">
        <div className="template-section-heading">
          <p className="template-kicker">Core capabilities</p>
          <h2>Built for the work.<br />Clear to the reviewer.</h2>
          <p>{data.servicesLead}</p>
        </div>
        <ol className="template-service-ledger">
          {data.services.map((service, index) => (
            <li key={service.name}>
              <span>{String(index + 1).padStart(2, "0")}</span><h3>{service.name}</h3><p>{service.detail}</p>
              {service.href ? <Link className="template-service-deep-link" href={service.href} aria-label={`Learn more about ${service.name}`}><ArrowUpRight aria-hidden="true" size={18} /></Link> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="template-feature" id="proof">
        <div className="template-feature-media"><Image src={data.feature.media} alt="JZ Demolition representative field work" fill sizes="100vw" /></div>
        <div className="template-feature-shade" />
        <div className="template-feature-copy">
          <p className="template-kicker">{data.feature.eyebrow}</p><h2>{data.feature.title}</h2><p>{data.feature.description}</p>
          <dl>{data.feature.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        </div>
      </section>

      <section className="template-process" id="process">
        <div className="template-section-heading compact"><p className="template-kicker">How the work moves</p><h2>One clear sequence.</h2></div>
        <ol>{data.process.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </section>
      <TemplateContact data={data} />
    </main>
  );
}

function WasteSite({ data }: { data: DivisionTemplateData }) {
  const emailSubject = encodeURIComponent(`${data.name} project inquiry`);
  return (
    <main className="division-template waste-site">
      <DivisionHeader division={data.slug} />
      <section className="waste-hero" id="top">
        <div className="waste-hero-media"><HeroMedia data={data} /></div>
        <div className="waste-hero-shade" />
        <div className="waste-hero-copy">
          <p className="template-kicker">Contractor support / South Florida</p>
          <h1>Keep the site moving.</h1>
          <p>{data.introduction}</p>
          <a href={`mailto:${data.email}?subject=${emailSubject}`}>Schedule service <ArrowUpRight aria-hidden="true" size={18} /></a>
        </div>
        <div className="waste-command-strip" aria-label="Waste service workflow">
          <span>01 / Size</span><span>02 / Deliver</span><span>03 / Swap</span><span>04 / Haul</span>
        </div>
      </section>

      <section className="waste-promise" id="capabilities">
        <p className="template-kicker">The operating promise</p>
        <h2>Site service should run like clockwork.</h2>
        <p>{data.servicesLead}</p>
        <dl>{data.proof.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </section>

      <section className="waste-service-board">
        <div className="waste-board-title"><p className="template-kicker">What we move</p><h2>Six ways we keep the work clear.</h2></div>
        <ol>{data.services.map((service, index) => <li key={service.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{service.name}</h3><p>{service.detail}</p>{service.href ? <Link href={service.href}>Review service <ArrowUpRight aria-hidden="true" size={15} /></Link> : null}</div><ArrowRight aria-hidden="true" size={22} /></li>)}</ol>
      </section>

      <section className="waste-proof" id="proof">
        <div className="waste-proof-media"><Image src={data.feature.media} alt="JZ Waste Management truck serving a South Florida jobsite" fill sizes="(max-width: 800px) 100vw, 62vw" /></div>
        <div className="waste-proof-copy">
          <p className="template-kicker">{data.feature.eyebrow}</p>
          <h2>{data.feature.title}</h2>
          <p>{data.feature.description}</p>
          <dl>{data.feature.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        </div>
      </section>

      <section className="waste-dispatch" id="process">
        <header><p className="template-kicker">Contractor workflow</p><h2>From call to clear site.</h2></header>
        <ol>{data.process.map((step) => <li key={step.number}><strong>{step.number}</strong><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </section>
      <TemplateContact data={data} />
    </main>
  );
}

function ConstructionSite({ data }: { data: DivisionTemplateData }) {
  const emailSubject = encodeURIComponent(`${data.name} project inquiry`);
  return (
    <main className="division-template construction-site">
      <DivisionHeader division={data.slug} />
      <section className="construction-hero" id="top">
        <div className="construction-hero-media"><HeroMedia data={data} /></div>
        <div className="construction-hero-shade" />
        <div className="construction-hero-copy">
          <p className="template-kicker">{data.discipline}</p>
          <h1>Field execution,<br />{" "}made visible.</h1>
          <p>{data.introduction}</p>
        </div>
        <aside className="construction-scope-rail" aria-label="Construction scope summary">
          <p>Current capability set</p>
          <dl><div><dt>01</dt><dd>Site preparation</dd></div><div><dt>02</dt><dd>Framing + drywall</dd></div><div><dt>03</dt><dd>Finishes + handover</dd></div></dl>
          <a href={`mailto:${data.email}?subject=${emailSubject}`}>Discuss the scope <ArrowUpRight aria-hidden="true" size={17} /></a>
        </aside>
      </section>

      <section className="construction-intro" id="capabilities">
        <div><p className="template-kicker">Construction capability</p><h2>From layout to finished space.</h2></div>
        <p>{data.servicesLead}</p>
      </section>

      <section className="construction-capability-grid">
        {data.services.map((service, index) => (
          <article key={service.name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.name}</h3><p>{service.detail}</p>{service.href ? <Link href={service.href}>Review service <ArrowUpRight aria-hidden="true" size={15} /></Link> : null}</article>
        ))}
      </section>

      <section className="construction-field-story" id="proof">
        <figure className="construction-field-main"><Image src="/media/field-story/field-control.webp" alt="JZ Construction field installation" fill sizes="(max-width: 800px) 100vw, 66vw" /></figure>
        <div className="construction-field-copy"><p className="template-kicker">Inside the field</p><h2>Built by people who understand the full site.</h2><p>{data.feature.description}</p></div>
        <figure className="construction-field-detail"><Image src="/media/field-story/field-leadership.webp" alt="JZ field leadership reviewing construction work" fill sizes="(max-width: 800px) 100vw, 34vw" /></figure>
      </section>

      <section className="construction-method" id="process">
        <header><p className="template-kicker">The field method</p><h2>A visible plan from first walk to handover.</h2></header>
        <ol>{data.process.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
      </section>
      <TemplateContact data={data} />
    </main>
  );
}

function DevelopmentSite({ data }: { data: DivisionTemplateData }) {
  const emailSubject = encodeURIComponent(`${data.name} project inquiry`);
  return (
    <main className="division-template development-site">
      <DivisionHeader division={data.slug} />
      <section className="development-hero" id="top">
        <div className="development-hero-media"><HeroMedia data={data} /></div>
        <div className="development-hero-shade" />
        <div className="development-hero-copy">
          <p className="template-kicker">{data.discipline}</p>
          <h1>Think beyond completion.</h1>
          <p>{data.introduction}</p>
          <a href={`mailto:${data.email}?subject=${emailSubject}`}>Start a conversation <ArrowUpRight aria-hidden="true" size={18} /></a>
        </div>
        <ol className="development-lifecycle" aria-label="Development lifecycle"><li>Acquire</li><li>Plan</li><li>Build</li><li>Manage</li></ol>
      </section>

      <section className="development-thesis" id="capabilities">
        <p className="template-kicker">The development thesis</p>
        <h2>Value is created across the entire lifecycle.</h2>
        <p>{data.servicesLead}</p>
      </section>

      <section className="development-stages">
        {data.process.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
      </section>

      <section className="development-project" id="proof">
        <div className="development-project-media"><video autoPlay muted loop playsInline preload="metadata" poster={data.feature.poster}><source src={data.feature.media} type="video/mp4" /></video></div>
        <div className="development-project-copy"><p className="template-kicker">{data.feature.eyebrow}</p><h2>{data.feature.title}</h2><p>{data.feature.description}</p><dl>{data.feature.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div>
      </section>

      <section className="development-capabilities" id="process">
        <header><p className="template-kicker">Platform capabilities</p><h2>One view of the asset. Six connected capabilities.</h2></header>
        <ol>{data.services.map((service, index) => <li key={service.name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.name}</h3><p>{service.detail}</p></li>)}</ol>
      </section>
      <TemplateContact data={data} />
    </main>
  );
}

export function DivisionTemplate({ data }: { data: DivisionTemplateData }) {
  if (data.slug === "waste-management") return <WasteSite data={data} />;
  if (data.slug === "construction") return <ConstructionSite data={data} />;
  if (data.slug === "development") return <DevelopmentSite data={data} />;
  return <DemolitionSite data={data} />;
}
