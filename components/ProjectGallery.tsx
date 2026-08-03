"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { featuredProjects } from "@/app/data";

type FeaturedProject = (typeof featuredProjects)[number];

export function ProjectGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState<FeaturedProject | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (active && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [active]);

  const openProject = (project: FeaturedProject, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActive(project);
  };

  const closeProject = () => {
    if (!dialogRef.current || closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      dialogRef.current?.close();
      setActive(null);
      setClosing(false);
      openerRef.current?.focus();
    }, 320);
  };

  return (
    <>
      <div className="project-grid">
        {featuredProjects.map((project) => (
          <button
            className="project-tile"
            key={project.index}
            onClick={(event) => openProject(project, event.currentTarget)}
            type="button"
          >
            <span className="project-tile-media">
              <span>{project.index}</span>
              <strong>{project.mediaLabel}</strong>
              <small>LANDSCAPE ASSET / PENDING</small>
            </span>
            <span className="project-tile-meta"><span>{project.market}</span><span>{project.location}</span></span>
            <strong className="project-tile-title">{project.title}</strong>
            <span className="project-tile-scope">{project.scope}</span>
            <ArrowUpRight aria-hidden="true" size={21} strokeWidth={1.5} />
          </button>
        ))}
      </div>

      <dialog
        className="project-dialog"
        data-closing={closing ? "true" : "false"}
        onCancel={(event) => { event.preventDefault(); closeProject(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeProject(); }}
        ref={dialogRef}
      >
        {active ? (
          <div className="project-dialog-shell">
            <button className="project-dialog-close" onClick={closeProject} type="button" aria-label="Close project preview">
              <X aria-hidden="true" />
            </button>
            <div className="project-dialog-media">
              <span>{active.mediaLabel}</span>
              <small>PROJECT IMAGE SEQUENCE / ASSETS PENDING</small>
            </div>
            <article className="project-dialog-copy">
              <p className="eyebrow">{active.index} / {active.market} / {active.location}</p>
              <h2>{active.title}</h2>
              <p>{active.summary}</p>
              <dl>
                {active.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <p className="project-dialog-next">Full case study and approved photography will follow content review.</p>
            </article>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
