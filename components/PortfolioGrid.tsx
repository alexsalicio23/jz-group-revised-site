import { Image as ImageIcon } from "lucide-react";
import { groupPortfolioProjects } from "@/app/content-data";

export function PortfolioGrid() {
  return (
    <div className="portfolio-grid" aria-label="JZ Group project portfolio">
      {groupPortfolioProjects.map((project, index) => (
        <article className="portfolio-card" key={project.name}>
          <div className="portfolio-card-media" aria-label={`Photography placeholder for ${project.name}`} role="img">
            <span className="portfolio-card-watermark" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="portfolio-card-placeholder">
              <ImageIcon aria-hidden="true" />
              Photo pending
            </span>
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
