import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/CinematicHero";
import { DivisionSequence } from "@/components/DivisionSequence";
import { BidForm } from "@/components/BidForm";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ServiceAreaRadar } from "@/components/ServiceAreaRadar";
import { GroupHeader } from "@/components/SiteNavigation";
import { activeProcess, clientLogos, contact, publicPortfolioStats, qualificationRecords } from "./data";

export default function Home() {
  return (
    <main>
      <GroupHeader />
      <CinematicHero />

      <DivisionSequence />

      <section className="experience-strip" id="experience" aria-label="Public project experience">
        <div className="experience-strip-title">
          <span>Public portfolio</span>
          <strong>Experience across complex environments.</strong>
        </div>
        <dl>
          {publicPortfolioStats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd><Link href={stat.href}>{stat.value}</Link></dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="trust-strip">
        <span>Built for</span>
        <ul>
          <li>Active hospitals</li>
          <li>Occupied facilities</li>
          <li>Education</li>
          <li>Commercial interiors</li>
          <li>Concrete + structural</li>
        </ul>
      </div>

      <section className="active-environments section-light" id="expertise">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Specialty demolition / Active environments</p>
            <h2>The building keeps moving.<br />So does the work.</h2>
          </div>
          <p>
            JZ plans difficult demolition around the people, systems, and schedules that remain
            active beside the work.
          </p>
        </div>

        <div className="active-grid">
          <figure className="active-visual">
            <Image
              src="/media/field-story/field-leadership.webp"
              alt="JZ field leadership reviewing work inside a framed commercial interior"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
            <figcaption>Representative field work across JZ projects.</figcaption>
          </figure>
          <ol className="process-list">
            {activeProcess.map((step) => (
              <li key={step.title}>
                <Link href={step.href}>
                  <span>{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                  <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="project-proof section-light" id="projects" aria-labelledby="projects-title">
        <div className="home-section-heading proof-intro">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="projects-title">Comparable work.</h2>
          </div>
          <Link className="text-link" href="/projects">
            View projects <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <ProjectGallery />
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
          <p className="eyebrow">Safety and qualifications</p>
          <h2>Safety is the operating system.</h2>
          <div className="qualification-list">
            {qualificationRecords.map((record, index) => (
              <details key={record.title}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{record.title}<span aria-hidden="true">+</span></summary>
                <p>{record.description}</p>
              </details>
            ))}
          </div>
          <Link className="text-link" href="/safety">
            View safety approach <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <section className="signal-band" aria-labelledby="band-title">
        <div>
          <h2 id="band-title">The building<br />never closes.<br />Neither do we.</h2>
        </div>
        <div>
          <p>
            Nights, phased windows, and live-floor sequencing. JZ works around the
            operation instead of asking it to stop.
          </p>
          <div className="band-actions">
            <Link href="/contact">Send a scope <ArrowUpRight aria-hidden="true" size={16} /></Link>
            <Link href="/safety">Safety approach <ArrowUpRight aria-hidden="true" size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="clients section-light" aria-labelledby="clients-title">
        <div className="home-section-heading clients-heading">
          <div>
            <p className="eyebrow">Selected relationships</p>
            <h2 id="clients-title">The company behind the bid.</h2>
          </div>
        </div>
        <div className="logo-grid">
          {clientLogos.map((client) => (
            <div className="client-logo" key={client.name} tabIndex={0}>
              <span className="client-logo-mark">
                <Image
                  src={client.src}
                  alt={client.name}
                  fill
                  sizes="(max-width: 760px) 42vw, 16vw"
                  unoptimized
                />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="contact home-contact" id="contact">
        <div className="contact-heading">
          <p className="eyebrow light">Estimating / South Florida</p>
          <h2>Have a scope?</h2>
          <p>Send it once. JZ Group will route it to the right company.</p>
          <div className="contact-direct">
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <ServiceAreaRadar />
        </div>
        <BidForm />
        <footer>
          <span>JZ Group</span>
          <span>{contact.address}</span>
          <span>Miami-Dade / Broward / Palm Beach</span>
        </footer>
      </section>
    </main>
  );
}
