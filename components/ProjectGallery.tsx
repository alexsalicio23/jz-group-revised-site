"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
            aria-label={`Open ${project.title} project summary`}
          >
            <span className="project-tile-media">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                style={{ objectPosition: project.imagePosition }}
              />
              <span className="project-image-caption">{project.index} / {project.market}</span>
            </span>
            <span className="project-tile-meta">{project.market} / {project.location}</span>
            <strong className="project-tile-title">{project.title}</strong>
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
              <p className="eyebrow">{active.index} / {active.market} / {active.location}</p>
              <h2>{active.title}</h2>
              <p>{active.summary}</p>
              <dl>
                {active.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <Link className="project-dialog-link" href={active.href}>
                View project details <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            </article>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
