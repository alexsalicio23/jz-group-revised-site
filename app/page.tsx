import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BidForm } from "@/components/BidForm";
import { DivisionIndex } from "@/components/DivisionIndex";
import { ProjectGallery } from "@/components/ProjectGallery";
import { GroupHeader } from "@/components/SiteNavigation";
import { activeProcess, clientLogos, contact, publicPortfolioStats, qualificationRecords } from "./data";

export default function Home() {
  return (
    <main className="metric-home">
      <GroupHeader />

      <section className="metric-hero" id="top" aria-labelledby="home-title">
        <video
          className="metric-hero-media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/video/hero-demolition-poster.jpg"
          aria-label="Specialty demolition underway inside a commercial building"
        >
          <source src="/media/video/hero-demolition-mobile.mp4" type="video/mp4" media="(max-width: 760px)" />
          <source src="/media/video/hero-demolition.mp4" type="video/mp4" />
        </video>
        <div className="metric-hero-shade" />
        <div className="metric-hero-copy">
          <p>JZ Group / South Florida</p>
          <h1 id="home-title">Built around<br />what can&apos;t stop.</h1>
          <div className="metric-hero-summary">
            <p>
              Four coordinated companies built for specialty demolition, construction,
              waste management, and development.
            </p>
            <div>
              <Link href="#companies">Explore the group <ArrowUpRight aria-hidden="true" size={17} /></Link>
              <Link href="/contact">Send a scope <ArrowUpRight aria-hidden="true" size={17} /></Link>
            </div>
          </div>
        </div>
        <div className="metric-hero-register" aria-label="JZ Group operating summary">
          <span>Specialty demolition</span>
          <span>Active environments</span>
          <span>One operating group</span>
        </div>
        <a className="metric-scroll-cue" href="#standard" aria-label="Continue to the next section">
          <span>Scroll</span><ArrowDown aria-hidden="true" size={18} />
        </a>
      </section>

      <section className="metric-statement" id="standard">
        <p className="section-index">01 / The operating standard</p>
        <div className="metric-statement-grid">
          <h2>One standard<br />across every handoff.</h2>
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
          <p>Specialty work / Active environments</p>
          <h2 id="field-title">The building keeps moving.<br />So do we.</h2>
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

      <section className="metric-companies" id="companies" aria-labelledby="companies-title">
        <header className="metric-section-header">
          <p className="section-index">02 / The group</p>
          <h2 id="companies-title">Four companies.<br />One accountable workflow.</h2>
          <p>Each company owns a specific part of the work. All four answer to the same standard.</p>
        </header>
        <DivisionIndex />
      </section>

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
          <p className="section-index">03 / Accountability</p>
          <h2 id="delivery-title">First to plan.<br />Last to leave.</h2>
          <p>
            The scope is not finished when material comes down. JZ plans the handoff,
            coordinates the supporting companies, and leaves the next team ready to move.
          </p>
          <Link className="metric-text-link" href="/values">Review group standards <ArrowUpRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>

      <section className="metric-proof" aria-labelledby="proof-title">
        <header>
          <p className="section-index">04 / Public portfolio</p>
          <h2 id="proof-title">Experience you can qualify.</h2>
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
          <p className="section-index">05 / Selected work</p>
          <h2 id="projects-title">Comparable work.<br />Clear project records.</h2>
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
          <p className="section-index">06 / Safety and qualifications</p>
          <h2 id="safety-title">Safety is part of the deliverable.</h2>
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
          <p className="section-index">07 / Estimating</p>
          <h2 id="contact-title">Put the scope<br />in front of JZ.</h2>
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
