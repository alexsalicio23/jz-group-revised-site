import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { groupPortfolioProjects } from "@/app/content-data";

export function PortfolioGrid() {
  return (
    <div className="portfolio-grid" aria-label="JZ Group project portfolio">
      {groupPortfolioProjects.map((project, index) => (
        <article className="portfolio-card" key={project.name}>
          <div
            className={`portfolio-card-media${project.media ? " has-media" : ""}`}
            aria-label={project.media ? undefined : `Photography placeholder for ${project.name}`}
            role={project.media ? undefined : "img"}
          >
            {project.media ? (
              <Image
                alt={project.media.alt}
                fill
                sizes="(max-width: 620px) 100vw, (max-width: 1040px) 50vw, 33vw"
                src={project.media.src}
                style={{ objectPosition: project.media.position }}
              />
            ) : null}
            <span className="portfolio-card-watermark" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {!project.media ? (
              <span className="portfolio-card-placeholder">
                <ImageIcon aria-hidden="true" />
                Photo pending
              </span>
            ) : null}
          </div>
          <div className="portfolio-card-copy">
            <span>{String(index + 1).padStart(2, "0")} / Project record</span>
            <h3>{project.name}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
