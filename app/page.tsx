import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/CinematicHero";
import { DivisionSequence } from "@/components/DivisionSequence";
import { activeProcess, clientLogos, contact } from "./data";

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="JZ Group home">
        <Image src="/media/brand-logo.webp" alt="JZ Group" width={164} height={82} priority />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#expertise">Expertise</a>
        <a href="#group">The group</a>
        <a href="#projects">Proof</a>
        <a href="#qualifications">Safety</a>
      </nav>
      <a className="header-contact" href="#contact">Start a bid conversation</a>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href="#expertise">Expertise</a>
          <a href="#group">The group</a>
          <a href="#projects">Proof</a>
          <a href="#qualifications">Safety</a>
          <a href="#contact">Contact estimating</a>
        </nav>
      </details>
    </header>
  );
}

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <CinematicHero />

      <section className="proof-rail" aria-label="Featured project facts">
        <div className="proof-rail-title">
          <span>Featured record</span>
          <strong>Baptist Medical Arts Building / Fourth Floor</strong>
        </div>
        <dl>
          <div><dt>Scope</dt><dd>16,300 SF</dd></div>
          <div><dt>Condition</dt><dd>Active hospital</dd></div>
          <div><dt>Execution</dt><dd>Overnight</dd></div>
        </dl>
      </section>

      <section className="active-environments section-light" id="expertise">
        <div className="section-intro active-intro">
          <p className="eyebrow">Active environments</p>
          <h2>The building keeps moving.<br />So does the work.</h2>
          <p>
            Specialty demolition is less about force than control. JZ plans the scope around the
            people, systems, and schedules that remain active around the work.
          </p>
        </div>

        <div className="active-grid">
          <figure className="active-visual">
            <Image
              src="/media/field-story/demolition-floor.webp"
              alt="JZ demolition work inside a commercial interior"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
            <figcaption>Representative field work across JZ projects.</figcaption>
          </figure>
          <ol className="process-list">
            {activeProcess.map((step) => (
              <li key={step.title}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DivisionSequence />

      <section className="project-proof section-light" id="projects">
        <div className="section-intro proof-intro">
          <p className="eyebrow">Comparable work</p>
          <h2>Proof, not promises.</h2>
          <p>
            A bid reviewer should be able to understand the setting, scope, constraint, and result
            without digging through marketing language.
          </p>
        </div>

        <article className="project-record project-record-featured">
          <div className="project-record-heading">
            <p className="record-index">01 / Active healthcare</p>
            <h3>Baptist Medical Arts Building</h3>
            <p>Fourth-floor selective interior demolition</p>
          </div>
          <div className="project-stat"><strong>16,300</strong><span>square feet</span></div>
          <dl className="project-ledger">
            <div><dt>Operating condition</dt><dd>Active hospital</dd></div>
            <div><dt>Execution window</dt><dd>Overnight</dd></div>
            <div><dt>Result</dt><dd>Floor cleared and ready for the next phase while hospital operations continued.</dd></div>
          </dl>
        </article>

        <article className="project-record project-record-secondary">
          <div className="project-record-heading">
            <p className="record-index">02 / Medical office</p>
            <h3>Broward MOB</h3>
            <p>Pompano Beach, Florida</p>
          </div>
          <div className="project-stat"><strong>3</strong><span>stories</span></div>
          <dl className="project-ledger">
            <div><dt>Scope</dt><dd>Interior demolition</dd></div>
            <div><dt>Concrete work</dt><dd>Scanning and cutting</dd></div>
            <div><dt>Delivery</dt><dd>Multi-floor demolition with concrete work handled within the same scope.</dd></div>
          </dl>
        </article>
      </section>

      <section className="safety" id="qualifications">
        <div className="safety-image">
          <Image
            src="/media/field-story/safety-detail.webp"
            alt="Hard hat used during JZ field operations"
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
          />
        </div>
        <div className="safety-copy">
          <p className="eyebrow light">Safety and qualifications</p>
          <h2>Safety is the operating system.</h2>
          <p className="safety-lede">
            In active and occupied environments, safety, planning, and communication are part of
            the deliverable. They are not a paragraph added after the scope.
          </p>
          <div className="qualification-list">
            <p>Active-facility experience</p>
            <p>Site-specific planning</p>
            <p>Experienced field supervision</p>
            <p>Clean turnover to the next trade</p>
          </div>
          <a className="text-link light-link" href={`mailto:${contact.email}?subject=JZ%20Group%20Qualification%20Package`}>
            Request the qualification package <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <section className="clients section-light" aria-labelledby="clients-title">
        <div className="clients-heading">
          <p className="eyebrow">Selected relationships</p>
          <h2 id="clients-title">The company behind the bid.</h2>
          <p>Client and contractor marks shown for draft review; final public use remains subject to approval.</p>
        </div>
        <div className="logo-grid">
          {clientLogos.map((client) => (
            <div className="client-logo" key={client.name}>
              <Image src={client.src} alt={client.name} width={180} height={90} sizes="180px" />
            </div>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-heading">
          <p className="eyebrow light">Estimating / South Florida</p>
          <h2>Send the scope.<br />We will route the work.</h2>
        </div>
        <div className="contact-action">
          <p>
            Tell us the service lane, location, project type, active or occupied status, and expected timeline.
          </p>
          <a className="button button-accent" href={`mailto:${contact.email}?subject=Bid%20Request%20for%20JZ%20Group`}>
            Email estimating
          </a>
        </div>
        <footer>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span>{contact.address}</span>
          <span>Miami-Dade / Broward / Palm Beach</span>
        </footer>
      </section>
    </main>
  );
}
