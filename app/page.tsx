import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BidForm } from "@/components/BidForm";
import { CinematicHero } from "@/components/CinematicHero";
import { DivisionSequence } from "@/components/DivisionSequence";
import { ProjectGallery } from "@/components/ProjectGallery";
import { GroupHeader } from "@/components/SiteNavigation";
import { activeProcess, clientLogos, contact, publicPortfolioStats, qualificationRecords } from "./data";

export default function Home() {
  return (
    <main className="metric-home">
      <GroupHeader />

      <CinematicHero />

      <section className="metric-statement" id="standard">
        <div className="metric-statement-grid">
          <h2>One standard across every handoff</h2>
          <div>
            <p>
              JZ Group coordinates the work before, during, and after the cut. The result is
              clearer ownership, fewer disconnected vendors, and a site that keeps moving.
            </p>
            <Link className="metric-text-link" href="/about">How the group works <ArrowUpRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
        <div className="metric-system-line" aria-hidden="true">
          <span>Plan</span><i /><span>Protect</span><i /><span>Execute</span><i /><span>Turn over</span>
        </div>
      </section>

      <section className="metric-trust" aria-label="Selected client relationships">
        <p>Trusted across South Florida</p>
        <div className="metric-logo-row">
          {clientLogos.map((client) => (
            <span className="metric-logo" key={client.name}>
              <Image src={client.src} alt={client.name} fill sizes="150px" unoptimized />
            </span>
          ))}
        </div>
      </section>

      <section className="metric-field-story" aria-labelledby="field-title">
        <Image
          src="/media/field-story/hero-field.webp"
          alt="JZ crews coordinating work inside a complex commercial interior"
          fill
          sizes="100vw"
        />
        <div className="metric-field-shade" />
        <div className="metric-field-copy">
          <h2 id="field-title">The building keeps moving so do we</h2>
        </div>
        <ol className="metric-process">
          {activeProcess.map((step) => (
            <li key={step.title}>
              <Link href={step.href}>
                <span>{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
                <ArrowUpRight aria-hidden="true" size={19} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <DivisionSequence />

      <section className="metric-delivery" aria-labelledby="delivery-title">
        <div className="metric-delivery-media">
          <Image
            src="/media/field-story/one-group.webp"
            alt="JZ Group field team member representing the four operating companies"
            fill
            sizes="(max-width: 840px) 100vw, 46vw"
            style={{ objectPosition: "center 35%" }}
          />
        </div>
        <div className="metric-delivery-copy">
          <h2 id="delivery-title">First to plan last to leave</h2>
          <p>
            The scope is not finished when material comes down. JZ plans the handoff,
            coordinates the supporting companies, and leaves the next team ready to move.
          </p>
          <Link className="metric-text-link" href="/values">Review group standards <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>

      <section className="metric-proof" aria-labelledby="proof-title">
        <header>
          <h2 id="proof-title">Experience you can qualify</h2>
        </header>
        <div className="metric-proof-grid">
          {publicPortfolioStats.map((stat) => (
            <Link href={stat.href} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <ArrowUpRight aria-hidden="true" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="metric-projects" id="projects" aria-labelledby="projects-title">
        <header className="metric-section-header">
          <h2 id="projects-title">Comparable work clear project records</h2>
          <Link className="metric-text-link" href="/projects">View all projects <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </header>
        <ProjectGallery />
      </section>

      <section className="metric-safety" aria-labelledby="safety-title">
        <div className="metric-safety-media">
          <Image
            src="/media/field-story/safety-detail.webp"
            alt="JZ safety equipment used during field operations"
            fill
            sizes="(max-width: 840px) 100vw, 42vw"
            style={{ objectPosition: "center 28%" }}
          />
        </div>
        <div className="metric-safety-copy">
          <h2 id="safety-title">Safety is part of the deliverable</h2>
          <div className="metric-qualification-list">
            {qualificationRecords.map((record, index) => (
              <details key={record.title} open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{record.title}<i aria-hidden="true">+</i></summary>
                <p>{record.description}</p>
              </details>
            ))}
          </div>
          <Link className="metric-text-link is-light" href="/safety">Review safety approach <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>

      <section className="metric-contact" id="contact" aria-labelledby="contact-title">
        <div className="metric-contact-intro">
          <h2 id="contact-title">Put the scope in front of JZ</h2>
          <p>Send it once. The group routes it to the company responsible for the work.</p>
          <div>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
        <BidForm />
      </section>

      <footer className="metric-footer">
        <div className="metric-footer-brand">
          <Image src="/media/brand-logo.webp" alt="JZ Group" width={220} height={110} />
          <p>Specialty work for active, occupied, and complex environments.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/demolition">Demolition</Link>
          <Link href="/construction">Construction</Link>
          <Link href="/waste-management">Waste Management</Link>
          <Link href="/development">Development</Link>
        </nav>
        <div className="metric-footer-meta">
          <span>{contact.address}</span>
          <span>Miami-Dade / Broward / Palm Beach</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
