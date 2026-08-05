"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { featuredProjects } from "@/app/data";
import {
  ActionCircle,
  CircleTransitionLink,
  MediaTilt,
  useMotionReveal,
} from "@/components/MotionSystem";

type FeaturedProject = (typeof featuredProjects)[number];

export function ProjectGallery() {
  const { runReveal } = useMotionReveal();
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
    const source = opener.querySelector<HTMLElement>(".motion-action-circle") ?? opener;
    runReveal({ source, tone: "demolition", onCovered: () => setActive(project) });
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
            aria-label={`Open ${project.title} project summary`}
          >
            <MediaTilt className="project-tile-media">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                style={{ objectPosition: project.imagePosition }}
              />
              <span className="project-image-caption">{project.index} / {project.market}</span>
            </MediaTilt>
            <span className="project-tile-meta">{project.market} / {project.location}</span>
            <strong className="project-tile-title">{project.title}</strong>
            <ActionCircle />
          </button>
        ))}
      </div>

      <dialog
        className="project-dialog"
        aria-labelledby="project-dialog-title"
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
              <Image
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                style={{ objectPosition: active.imagePosition }}
              />
              <span>{active.market} / {active.location}</span>
            </div>
            <article className="project-dialog-copy">
              <p className="sr-only">{active.index} / {active.market} / {active.location}</p>
              <h2 id="project-dialog-title">{active.title}</h2>
              <p>{active.summary}</p>
              <dl>
                {active.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <CircleTransitionLink className="project-dialog-link" href={active.href} tone="demolition">
                <span>View project details</span><ActionCircle />
              </CircleTransitionLink>
            </article>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
