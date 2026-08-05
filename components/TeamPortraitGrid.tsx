"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { TeamMember } from "@/app/content-data";
import { divisionLabels } from "@/app/content-data";
import { ActionCircle, MediaTilt, useMotionReveal } from "@/components/MotionSystem";

export function TeamPortraitGrid({ members }: { members?: TeamMember[] }) {
  const approvedMembers = members?.filter((member) => (
    member.approved &&
    member.name &&
    member.role &&
    member.bio &&
    member.responsibilities.length > 0 &&
    member.portrait.approved &&
    member.portrait.src &&
    member.portrait.alt
  )) ?? [];
  const { runReveal } = useMotionReveal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState<TeamMember | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (active && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [active]);

  if (!approvedMembers.length) return null;

  const openMember = (member: TeamMember, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    const source = opener.querySelector<HTMLElement>(".motion-action-circle") ?? opener;
    runReveal({ source, tone: member.division, onCovered: () => setActive(member) });
  };

  const closeMember = () => {
    if (!dialogRef.current || closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      dialogRef.current?.close();
      setActive(null);
      setClosing(false);
      openerRef.current?.focus();
    }, 240);
  };

  return (
    <>
      <div className="portrait-grid">
        {approvedMembers.map((member) => (
          <button
            className="portrait-card"
            key={`${member.name}-${member.role}`}
            onClick={(event) => openMember(member, event.currentTarget)}
            type="button"
            aria-label={`Learn about ${member.name}, ${member.role}`}
          >
            <MediaTilt className="portrait-card-media">
              <Image
                src={member.portrait.src}
                alt={member.portrait.alt}
                fill
                sizes="(max-width: 760px) 88vw, 33vw"
                style={{ objectPosition: member.portrait.position ?? "center" }}
              />
              <span className="portrait-card-shade" />
              <span className="portrait-card-identity">
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </span>
              <ActionCircle />
            </MediaTilt>
          </button>
        ))}
      </div>

      <dialog
        className="portrait-dialog"
        data-closing={closing ? "true" : "false"}
        aria-labelledby="portrait-dialog-title"
        onCancel={(event) => { event.preventDefault(); closeMember(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMember(); }}
        ref={dialogRef}
      >
        {active ? (
          <div className={`portrait-dialog-shell portrait-${active.division}`}>
            <button className="portrait-dialog-close" onClick={closeMember} type="button" aria-label="Close biography">
              <X aria-hidden="true" />
            </button>
            <div className="portrait-dialog-media">
              <Image
                src={active.portrait.src}
                alt={active.portrait.alt}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
                style={{ objectPosition: active.portrait.position ?? "center" }}
              />
            </div>
            <article>
              <p className="sr-only">{divisionLabels[active.division]}</p>
              <h2 id="portrait-dialog-title">{active.name}</h2>
              <h3>{active.role}</h3>
              <p>{active.bio}</p>
              <ul>{active.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
