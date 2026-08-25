import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { companySiteHref } from "@/app/company-sites";
import { displayHeading } from "@/app/display-text";
import type { DivisionTemplateData } from "@/app/templates/template-data";
import { ResponsiveVideo } from "@/components/ResponsiveVideo";
import { GroupHeader } from "@/components/SiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { BreadcrumbStructuredData, ServiceStructuredData } from "@/components/StructuredData";

function OverviewMedia({ data }: { data: DivisionTemplateData }) {
  if (data.hero.type === "image" && data.hero.media) {
    return <Image src={data.hero.media} alt={data.hero.alt ?? ""} fill priority sizes="100vw" />;
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
    <ResponsiveVideo
      src={data.hero.media!}
      mobileSrc={data.hero.mobileMedia}
      poster={data.hero.poster}
      ariaLabel={`${data.name} field operations`}
    />
  );
}

export function DivisionOverview({ data }: { data: DivisionTemplateData }) {
  const companyUrl = companySiteHref(data.slug);

  return (
    <main className={`company-overview company-overview-${data.slug}`}>
      <BreadcrumbStructuredData items={[
        { name: "JZ Group", path: "/" },
        { name: data.name, path: `/${data.slug}` },
      ]} />
      <ServiceStructuredData
        name={`${data.name} services`}
        description={data.introduction}
        path={`/${data.slug}`}
        division={data.slug}
      />
      <GroupHeader />
      <section className="company-overview-hero" id="top">
        <div className="company-overview-media"><OverviewMedia data={data} /></div>
        <div className="company-overview-shade" />
        <div className="company-overview-copy">
          <p>{data.legalName}</p>
          <h1>{data.name}</h1>
          <div>
            <strong>{displayHeading(data.headline)}</strong>
            <p>{data.introduction}</p>
            <a className="metric-button" href={companyUrl}>Visit the {data.shortName} site <ArrowUpRight aria-hidden="true" size={18} /></a>
          </div>
        </div>
        <a className="metric-scroll-cue" href="#overview-capabilities" aria-label={`Explore ${data.name}`}><span>Overview</span><ArrowDown aria-hidden="true" size={18} /></a>
      </section>

      <section className="company-overview-capabilities" id="overview-capabilities">
        <header>
          <h2>{displayHeading(data.servicesLead)}</h2>
          <p>A brief view of the company&apos;s core capabilities. Full service details, project information, and company contacts are available on its dedicated website.</p>
        </header>
        <div>
          {data.services.slice(0, 6).map((service, index) => (
            <article key={service.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{displayHeading(service.name)}</h3>
              <p>{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-overview-route">
        <div>
          <p>{data.discipline}</p>
          <h2>Continue to {data.name}</h2>
        </div>
        <div>
          <p>Explore the complete company site for detailed services, project experience, process, and estimating contacts.</p>
          <a href={companyUrl}>Open company website <ArrowUpRight aria-hidden="true" size={22} /></a>
          <Link href="/contact">Contact JZ Group</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
