import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ActiveMethod } from "@/components/ActiveMethod";
import { BidForm } from "@/components/BidForm";
import { GroupHero } from "@/components/GroupHero";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { ProjectGallery } from "@/components/ProjectGallery";
import { clientLogos } from "./data";
import { groupContact } from "./presentation-data";

function PresentationHeader() {
  return (
    <header className="v3-header">
      <Link className="v3-brand" href="#top" aria-label="JZ Group home">
        <Image src="/media/brand-logo.webp" alt="JZ Group" width={164} height={82} priority sizes="132px" />
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/divisions">Group</Link>
        <a href="#specialty">Specialty demolition</a>
        <a href="#active-facilities">Active facilities</a>
        <a href="#projects">Projects</a>
      </nav>
      <a className="v3-header-cta" href="#contact">Send a scope <ArrowUpRight aria-hidden="true" size={16} /></a>
      <details className="v3-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href="#group">Group</a><a href="#specialty">Specialty demolition</a><a href="#active-facilities">Active facilities</a><a href="#projects">Projects</a><a href="#contact">Contact</a>
        </nav>
      </details>
    </header>
  );
}

export default function Home() {
  return (
    <main className="v3-site">
      <PresentationHeader />
      <GroupHero />

      <section className="v3-specialty" id="specialty" aria-labelledby="specialty-title">
        <div className="v3-section-heading">
          <p className="v3-label">Specialty demolition / Active environments</p>
          <h2 id="specialty-title">Built for the work others avoid.</h2>
          <p>Selective demolition inside hospitals, occupied facilities, and complex commercial sites where the surrounding operation cannot simply stop.</p>
          <Link className="v3-text-link" href="/divisions/demolition">Explore JZ Demolition <ArrowUpRight aria-hidden="true" size={18} /></Link>
        </div>
        <div className="v3-exploded-slot">
          <MediaPlaceholder label="EXPLODED-VIEW STUDY" />
          <div className="v3-exploded-note"><span>Reserved signature experience</span><p>Creative direction and final asset sequence intentionally pending.</p></div>
        </div>
      </section>

      <ActiveMethod />

      <section className="v3-projects" id="projects" aria-labelledby="projects-title">
        <div className="v3-section-heading v3-section-heading-light">
          <p className="v3-label v3-label-light">Selected work / Three records</p>
          <h2 id="projects-title">Comparable work.<br />Immediately accessible.</h2>
          <p>Open a record for the setting, scope, and result. Continue to the full case study when deeper review is needed.</p>
        </div>
        <ProjectGallery compact />
        <Link className="v3-projects-all" href="/projects">View the project gallery <ArrowRight aria-hidden="true" size={19} /></Link>
      </section>

      <section className="v3-credibility" id="group" aria-labelledby="credibility-title">
        <div className="v3-section-heading">
          <p className="v3-label">Selected relationships</p>
          <h2 id="credibility-title">Known by the teams reviewing the bid.</h2>
          <p>Marks remain subject to final public-use approval. Hover or focus reveals each approved original.</p>
        </div>
        <div className="v3-logo-strip">
          {clientLogos.map((client) => (
            <div className="v3-client-logo" key={client.name} tabIndex={0}>
              <Image src={client.src} alt={client.name} width={180} height={90} sizes="(max-width: 760px) 34vw, 150px" />
            </div>
          ))}
        </div>
        <div className="v3-company-band">
          <MediaPlaceholder label="JZ TEAM / GROUP PHOTO" ratio="wide" />
          <div><p className="v3-label">The company behind the bid</p><h3>One field standard across four specialist companies.</h3><p>Estimating, supervision, logistics, and execution are coordinated around the work, not separated into competing promises.</p></div>
        </div>
      </section>

      <section className="v3-contact" id="contact" aria-labelledby="contact-title">
        <div className="v3-contact-copy">
          <p className="v3-label v3-label-light">Estimating / South Florida</p>
          <h2 id="contact-title">Send the scope.<br />We will route the work.</h2>
          <p>Share the service lane, project setting, location, timeline, and supporting files once.</p>
          <div className="v3-direct-contact">
            <a href={groupContact.phoneHref}>{groupContact.phoneDisplay}</a>
            <a href="mailto:estimating@jzdemo.com">estimating@jzdemo.com</a>
            <span>{groupContact.address}</span>
          </div>
        </div>
        <BidForm />
      </section>
    </main>
  );
}
