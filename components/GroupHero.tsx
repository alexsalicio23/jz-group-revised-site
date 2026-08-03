"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { presentationDivisions } from "@/app/presentation-data";

export function GroupHero() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="v3-group-hero" id="top" data-active={active ?? "none"}>
      <div className="v3-hero-intro">
        <p className="v3-label v3-label-light">JZ Group / South Florida</p>
        <h1>JZ GROUP</h1>
        <p className="v3-hero-statement">Four specialists. One accountable group.</p>
        <p className="v3-hero-summary">
          Specialty demolition, construction, waste management, and development coordinated under one standard.
        </p>
      </div>

      <div className="v3-division-fields" onMouseLeave={() => setActive(null)}>
        {presentationDivisions.map((division) => {
          const isActive = active === division.slug;
          return (
            <Link
              className="v3-division-field"
              data-division={division.slug}
              data-selected={isActive ? "true" : "false"}
              href={`/divisions/${division.slug}`}
              key={division.slug}
              onMouseEnter={() => setActive(division.slug)}
              onFocus={() => setActive(division.slug)}
              onBlur={() => setActive(null)}
            >
              <span className="v3-division-number">{division.number}</span>
              <div className="v3-division-media" aria-hidden="true">
                <span>{division.mediaLabel}</span>
              </div>
              <div className="v3-division-copy">
                <p>{division.shortName}</p>
                <h2>{division.name}</h2>
                <span className="v3-division-statement">{division.statement}</span>
              </div>
              <ArrowUpRight className="v3-division-arrow" aria-hidden="true" size={24} strokeWidth={1.5} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
