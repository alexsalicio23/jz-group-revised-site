"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { divisions } from "@/app/data";

const stills: Record<string, { src: string; alt: string; position?: string }> = {
  demolition: {
    src: "/media/website-photos/demolition-floor-removal.webp",
    alt: "JZ demolition worker operating floor-removal equipment inside an active facility",
    position: "center 52%",
  },
  construction: {
    src: "/media/website-photos/construction-framed-interior.webp",
    alt: "Commercial interior build-out with metal framing in progress",
  },
  "waste-management": {
    src: "/media/field-story/waste-truck.webp",
    alt: "JZ Waste Management truck supporting a South Florida project",
  },
  development: {
    src: "/media/development/workforce-housing-kitchen.webp",
    alt: "Completed workforce housing interior from JZ Development",
    position: "center",
  },
};

export function DivisionIndex() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.index);
        if (!Number.isNaN(next)) setActive(next);
      },
      { rootMargin: "-38% 0px -42% 0px", threshold: [0, 0.35, 0.75] },
    );

    rowRefs.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="division-index">
      <div className="division-index-media" aria-live="polite">
        {divisions.map((division, index) => {
          const still = stills[division.slug];
          return (
            <figure className={index === active ? "is-active" : ""} key={division.slug} aria-hidden={index !== active}>
              <Image
                src={still.src}
                alt={still.alt}
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
                style={{ objectPosition: still.position ?? "center" }}
              />
              <figcaption>{division.number} / {division.name}</figcaption>
            </figure>
          );
        })}
      </div>

      <nav className="division-index-list" aria-label="JZ Group companies">
        {divisions.map((division, index) => (
          <Link
            className={index === active ? "is-active" : ""}
            data-index={index}
            href={`/${division.slug}`}
            key={division.slug}
            onFocus={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            ref={(node) => { rowRefs.current[index] = node; }}
          >
            <span>{division.number}</span>
            <div>
              <h3>{division.short}</h3>
              <p>{division.description}</p>
            </div>
            <ArrowUpRight aria-hidden="true" size={26} strokeWidth={1.4} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
