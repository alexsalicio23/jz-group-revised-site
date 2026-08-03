"use client";

import Link from "next/link";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { PresentationProject, presentationProjects } from "@/app/presentation-data";

type ProjectGalleryProps = {
  projects?: PresentationProject[];
  compact?: boolean;
};

type ProjectOrigin = { x: number; y: number; scaleX: number; scaleY: number };

export function ProjectGallery({ projects = presentationProjects, compact = false }: ProjectGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState<PresentationProject | null>(null);
  const [origin, setOrigin] = useState<ProjectOrigin>({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  const [closing, setClosing] = useState(false);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!active || !dialogRef.current || dialogRef.current.open) return;
    dialogRef.current.showModal();
  }, [active]);

  const openProject = (project: PresentationProject, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setOrigin({
      x: rect.left,
      y: rect.top,
      scaleX: rect.width / window.innerWidth,
      scaleY: rect.height / window.innerHeight,
    });
    setActive(project);
  };

  const closeProject = () => {
    if (!dialogRef.current || closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      dialogRef.current?.close();
      setActive(null);
      setClosing(false);
    }, 420);
  };

  const originStyle = {
    "--project-origin-x": `${origin.x}px`,
    "--project-origin-y": `${origin.y}px`,
    "--project-origin-scale-x": origin.scaleX,
    "--project-origin-scale-y": origin.scaleY,
  } as CSSProperties;

  return (
    <>
      <div className={`v3-project-grid${compact ? " is-compact" : ""}`}>
        {projects.map((project) => (
          <button className="v3-project-tile" key={project.slug} onClick={(event) => openProject(project, event.currentTarget)} type="button">
            <span className="v3-project-media">
              <span className="v3-project-media-index">{project.index}</span>
              <span>{project.mediaLabel}</span>
              <small>16:9 / ASSET PENDING</small>
            </span>
            <span className="v3-project-meta"><span>{project.market}</span><span>{project.location}</span></span>
            <strong>{project.title}</strong>
            <span className="v3-project-scope">{project.scope}</span>
            <ArrowUpRight aria-hidden="true" size={21} strokeWidth={1.5} />
          </button>
        ))}
      </div>

      <dialog
        className="v3-project-dialog"
        data-closing={closing ? "true" : "false"}
        onCancel={(event) => { event.preventDefault(); closeProject(); }}
        ref={dialogRef}
        style={originStyle}
      >
        {active ? (
          <div className="v3-project-dialog-shell">
            <button className="v3-project-close" onClick={closeProject} type="button" aria-label="Close project preview"><X aria-hidden="true" /></button>
            <div className="v3-project-dialog-media">
              <span>{active.mediaLabel}</span>
              <small>PROJECT IMAGE SEQUENCE / ASSETS PENDING</small>
            </div>
            <article className="v3-project-dialog-copy">
              <p className="v3-label">{active.index} / {active.market} / {active.location}</p>
              <h2>{active.title}</h2>
              <p>{active.summary}</p>
              <dl>{active.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
              <Link href={`/projects/${active.slug}`}>View full case study <ArrowUpRight aria-hidden="true" size={18} /></Link>
            </article>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
