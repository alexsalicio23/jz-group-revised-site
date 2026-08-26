"use client";

import Image from "next/image";
import { Mail, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "@/app/content-data";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function TeamGrid({ members }: { members: readonly TeamMember[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (active && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [active]);

  const openProfile = (member: TeamMember, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActive(member);
  };

  const closeProfile = () => {
    dialogRef.current?.close();
    setActive(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  return (
    <>
      <div className="team-grid" data-count={members.length}>
        {members.map((member) => (
          <button
            aria-label={`View contact details for ${member.name}`}
            className="team-card"
            key={member.name}
            onClick={(event) => openProfile(member, event.currentTarget)}
            type="button"
          >
            <span className="team-card-portrait">
              {member.image ? (
                <Image
                  alt={member.imageAlt ?? `${member.name}, ${member.role}`}
                  fill
                  sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 25vw"
                  src={member.image}
                  style={{ objectPosition: member.imagePosition ?? "center" }}
                />
              ) : (
                <span aria-hidden="true" className="team-card-initials">{initials(member.name)}</span>
              )}
            </span>
            <span className="team-card-copy">
              <span className="team-card-name">{member.name}</span>
              <span className="team-card-role">{member.role}</span>
            </span>
            <span aria-hidden="true" className="team-card-action">+</span>
          </button>
        ))}
      </div>

      <dialog
        className="team-profile-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeProfile();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProfile();
        }}
        ref={dialogRef}
      >
        {active ? (
          <div className="team-profile-dialog-shell">
            <button aria-label="Close team profile" className="team-profile-dialog-close" onClick={closeProfile} type="button">
              <X aria-hidden="true" />
            </button>
            <div className="team-profile-dialog-portrait">
              {active.image ? (
                <Image
                  alt={active.imageAlt ?? `${active.name}, ${active.role}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                  src={active.image}
                  style={{ objectPosition: active.imagePosition ?? "center" }}
                />
              ) : (
                <span aria-hidden="true" className="team-profile-dialog-initials">{initials(active.name)}</span>
              )}
            </div>
            <article className="team-profile-dialog-copy">
              <p className="team-profile-dialog-label">JZ Group / Team</p>
              <h2>{active.name}</h2>
              <p className="team-profile-dialog-role">{active.role}</p>
              <dl>
                <div>
                  <dt><Phone aria-hidden="true" /> Phone</dt>
                  <dd>{active.phone ?? "To be confirmed"}</dd>
                </div>
                <div>
                  <dt><Mail aria-hidden="true" /> Email</dt>
                  <dd>{active.email ?? "To be confirmed"}</dd>
                </div>
              </dl>
              <p className="team-profile-dialog-note">Direct contact details will be added after JZ approval</p>
            </article>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
