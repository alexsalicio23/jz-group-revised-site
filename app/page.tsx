import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BidForm } from "@/components/BidForm";
import { CinematicHero } from "@/components/CinematicHero";
import { DivisionSequence } from "@/components/DivisionSequence";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { ProjectGallery } from "@/components/ProjectGallery";
import { GroupHeader } from "@/components/SiteNavigation";
import { activeProcess, clientLogos, contact, qualificationRecords } from "./data";

export default function Home() {
  return (
    <main>
      <GroupHeader />
      <CinematicHero />

      <DivisionSequence />

      <section className="active-environments section-light" id="expertise">
        <div className="section-intro active-intro">
          <p className="eyebrow">Specialty demolition / Active environments</p>
          <h2>The building keeps moving.<br />So does the work.</h2>
          <p>
            JZ plans difficult demolition around the people, systems, and schedules that remain
            active beside the work.
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
        <div className="section-intro proof-intro">
          <p className="eyebrow">Selected work / Three records</p>
          <h2 id="projects-title">Comparable work.<br />Immediately accessible.</h2>
          <p>
            Open a record for the setting, scope, and result. The deeper project gallery can grow
            as photography and case-study content are approved.
          </p>
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
          <p className="eyebrow light">Safety and qualifications</p>
          <h2>Safety is the operating system.</h2>
          <p className="safety-lede">
            In active and occupied environments, safety, planning, and communication are part of
            the deliverable.
          </p>
          <div className="qualification-list">
            {qualificationRecords.map((record, index) => (
              <details key={record.title}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{record.title}<span aria-hidden="true">+</span></summary>
                <p>{record.description}</p>
              </details>
            ))}
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
          <p>Relationships across healthcare, commercial construction, and development.</p>
        </div>
        <div className="logo-grid">
          {clientLogos.map((client) => (
            <div className="client-logo" key={client.name} tabIndex={0}>
              <Image src={client.src} alt={client.name} width={180} height={90} sizes="(max-width: 760px) 138px, 170px" />
            </div>
          ))}
        </div>
        <div className="company-media-grid">
          <MediaPlaceholder label="JZ TEAM PHOTO" ratio="wide" />
          <MediaPlaceholder label="FOUR COMPANIES / ONE GROUP PHOTO" ratio="wide" />
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-heading">
          <p className="eyebrow light">Estimating / South Florida</p>
          <h2>Send the scope.<br />We will route the work.</h2>
          <p>Share the service lane, project setting, timeline, and supporting files once.</p>
          <div className="contact-direct">
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>{contact.address}</span>
          </div>
        </div>
        <BidForm />
        <footer>
          <span>JZ Group</span>
          <span>Miami-Dade / Broward / Palm Beach</span>
          <span>Four companies / One accountable group</span>
        </footer>
      </section>
    </main>
  );
}
