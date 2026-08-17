"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { featuredProjects } from "@/app/data";
import { displayHeading } from "@/app/display-text";

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
        {featuredProjects.map((project) => {
          const cover = project.images[0];

          return (
            <button
              className="project-tile"
              key={project.index}
              onClick={(event) => openProject(project, event.currentTarget)}
              type="button"
              aria-label={`Open ${project.title} project summary`}
            >
              <span className="project-tile-media">
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 62vw"
                  style={{ objectPosition: cover.position }}
                />
                <span className="project-image-caption">{project.index} / {project.market}</span>
              </span>
              <span className="project-tile-meta">{project.market} / {project.location}</span>
              <strong className="project-tile-title">{project.title}</strong>
              <ArrowUpRight aria-hidden="true" size={21} strokeWidth={1.5} />
            </button>
          );
        })}
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
            <div className="project-dialog-gallery">
              {active.images.map((image, index) => (
                <div className={index === 0 ? "is-primary" : ""} key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={index === 0 ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 50vw, 29vw"}
                    style={{ objectPosition: image.position }}
                  />
                  {index === 0 ? <span>{active.market} / {active.location}</span> : null}
                </div>
              ))}
            </div>
            <article className="project-dialog-copy">
              <h2>{displayHeading(active.title)}</h2>
              <p className="project-dialog-scope">{active.scope}</p>
              <p>{active.summary}</p>
              <dl>
                {active.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <p className="project-dialog-note">
                Request the dated scope record and approved references from estimating.
              </p>
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
