import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { divisionContacts } from "@/app/content-data";
import type { DivisionTemplateData } from "@/app/templates/template-data";
import { ActionCircle, CircleTransitionLink } from "@/components/MotionSystem";
import { DivisionHeader } from "@/components/SiteNavigation";

function HeroMedia({ data }: { data: DivisionTemplateData }) {
  if (data.hero.type === "image" && data.hero.media) {
    return <Image src={data.hero.media} alt={data.hero.alt ?? ""} fill loading="eager" fetchPriority="high" sizes="100vw" />;
  }

  if (data.hero.type === "triptych" && data.hero.triptych) {
    return (
      <div className="metric-triptych" aria-hidden="true">
        {data.hero.triptych.map((item, index) => (
          <video autoPlay muted loop playsInline preload={index === 0 ? "auto" : "metadata"} poster={item.poster} key={item.media}>
            <source src={item.media} type="video/mp4" />
          </video>
        ))}
      </div>
    );
  }

  return (
    <video autoPlay muted loop playsInline preload="auto" poster={data.hero.poster} aria-label={`${data.name} field operations`}>
      {data.hero.mobileMedia ? <source src={data.hero.mobileMedia} type="video/mp4" media="(max-width: 760px)" /> : null}
      <source src={data.hero.media} type="video/mp4" />
    </video>
  );
}

function FeatureMedia({ data }: { data: DivisionTemplateData }) {
  if (data.feature.mediaType === "video") {
    return (
      <video autoPlay muted loop playsInline preload="metadata" poster={data.feature.poster} aria-label={data.feature.title}>
        <source src={data.feature.media} type="video/mp4" />
      </video>
    );
  }

  return <Image src={data.feature.media} alt={`${data.name} representative project work`} fill sizes="100vw" />;
}

export function DivisionTemplate({ data }: { data: DivisionTemplateData }) {
  const contact = divisionContacts[data.slug];

  return (
    <main className={`metric-division metric-division-${data.slug}`}>
      <DivisionHeader division={data.slug} />

      <section className="metric-division-hero" id="top">
        <div className="metric-division-hero-media"><HeroMedia data={data} /></div>
        <div className="metric-division-hero-shade" />
        <div className="metric-division-hero-copy">
          <p className="sr-only">{data.index} / {data.discipline}</p>
          <h1>{data.headline}</h1>
          <div>
            <p>{data.introduction}</p>
            <div>
              <Link className="metric-button" href={`/${data.slug}/contact`}>Send a scope <ArrowUpRight aria-hidden="true" size={17} /></Link>
              <a className="metric-hero-link" href={`mailto:${data.email}`}>{data.email}</a>
            </div>
          </div>
        </div>
        <a className="metric-scroll-cue" href="#capabilities" aria-label="Continue to capabilities"><span>Explore</span><ArrowDown aria-hidden="true" size={18} /></a>
      </section>

      <section className="metric-division-proof" aria-label={`${data.name} project facts`}>
        <p>{data.name}</p>
        <dl>
          {data.proof.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
        </dl>
      </section>

      <section className="metric-division-intro" id="capabilities">
        <p className="sr-only">Capabilities</p>
        <h2>{data.servicesLead}</h2>
      </section>

      <section className="metric-service-index" aria-label={`${data.name} services`}>
        {data.services.map((service, index) => {
          const content = (
            <>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.name}</h3>
              <p>{service.detail}</p>
              {service.href ? <ActionCircle /> : null}
            </>
          );
          return service.href
            ? <CircleTransitionLink href={service.href} tone={data.slug} key={service.name}>{content}</CircleTransitionLink>
            : <article key={service.name}>{content}</article>;
        })}
      </section>

      <section className="metric-division-feature" id="proof">
        <div className="metric-division-feature-media"><FeatureMedia data={data} /></div>
        <div className="metric-division-feature-shade" />
        <div className="metric-division-feature-copy">
          <p className="sr-only">{data.feature.eyebrow}</p>
          <h2>{data.feature.title}</h2>
          <div>
            <p>{data.feature.description}</p>
            <dl>{data.feature.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <section className="metric-division-process" id="process">
        <header>
          <p className="sr-only">How the work moves</p>
          <h2>One clear sequence.</h2>
        </header>
        <ol>
          {data.process.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="metric-division-contact" id="contact">
        <p className="sr-only">Have a scope?</p>
        <h2>{data.close}</h2>
        <div>
          <Link href={`/${data.slug}/contact`}>Send project details <ArrowUpRight aria-hidden="true" size={22} /></Link>
          <a href="tel:+13057932984">{contact.phone}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </section>

      <footer className="metric-subpage-footer">
        <div><strong>{data.name}</strong><span>{contact.address}</span></div>
        <div><span>South Florida</span><a href="tel:+13057932984">{contact.phone}</a></div>
        <div><Link href="/">JZ Group</Link><Link href={`/${data.slug}/contact`}>Contact</Link></div>
      </footer>
    </main>
  );
}
