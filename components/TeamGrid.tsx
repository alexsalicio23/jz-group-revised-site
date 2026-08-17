import Image from "next/image";
import type { TeamMember } from "@/app/content-data";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function TeamGrid({ members }: { members: readonly TeamMember[] }) {
  return (
    <div className="team-grid" data-count={members.length}>
      {members.map((member) => (
        <article className="team-card" key={member.name}>
          <div className="team-card-portrait">
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
          </div>
          <div className="team-card-copy">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
