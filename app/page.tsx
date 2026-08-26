import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicHero } from "@/components/CinematicHero";
import { DivisionSequence } from "@/components/DivisionSequence";
import { GroupLifecycle } from "@/components/GroupLifecycle";
import { ProjectGallery } from "@/components/ProjectGallery";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { QualificationAccordion } from "@/components/QualificationAccordion";
import { QualificationBand } from "@/components/QualificationBand";
import { QuickAccess } from "@/components/QuickAccess";
import { GroupHeader } from "@/components/SiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";
import { contact } from "./data";

export default function Home() {
  return (
    <main className="metric-home group-positioning-home">
      <GroupHeader />
      <CinematicHero />
      <QuickAccess />

      <div className="group-proof-photo" aria-label="JZ Group team photography placeholder">
        <PhotoPlaceholder
          label="JZ Group Field Team"
          note="Wide team photograph showing the four companies working together"
        />
      </div>

      <section className="metric-projects group-projects" id="projects" aria-labelledby="projects-title">
        <header className="metric-section-header">
          <h2 id="projects-title">Selected Work</h2>
          <Link className="metric-text-link" href="/projects">
            View all projects <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </header>
        <ProjectGallery />
      </section>

      <DivisionSequence />
      <GroupLifecycle />
      <QualificationBand />

      <section className="metric-safety group-safety" aria-labelledby="safety-title">
        <div className="metric-safety-media">
          <Image
            src="/media/website-photos/construction-plan-review.webp"
            alt="JZ field leadership reviewing project plans"
            fill
            sizes="(max-width: 840px) 100vw, 46vw"
            style={{ objectPosition: "center" }}
          />
        </div>
        <div className="metric-safety-copy">
          <h2 id="safety-title">Safety at Every Step</h2>
          <QualificationAccordion />
          <Link className="metric-text-link is-light" href="/safety">
            Review safety and qualifications <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      <section className="group-home-cta" id="contact" aria-labelledby="contact-title">
        <PhotoPlaceholder
          className="group-home-cta-media"
          label="Completed Project or Group Photo"
          note="Landscape image with clear space for the closing message"
        />
        <div className="group-home-cta-copy">
          <h2 id="contact-title">Start a Project</h2>
          <div className="group-home-cta-actions">
            <Link className="metric-button" href="/contact">
              Send a scope <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
            <Link className="group-home-cta-link" href="/safety">
              Review qualifications <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <div className="group-home-contact">
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
