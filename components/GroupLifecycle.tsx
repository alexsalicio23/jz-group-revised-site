"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const stages = [
  {
    number: "01",
    title: "Preconstruction",
    companies: "JZ Development + JZ Construction",
    description: "Evaluate the opportunity, define the delivery path, and align the project before fieldwork begins.",
    image: "/media/website-photos/construction-plan-review.webp",
    imageAlt: "JZ project leaders reviewing plans before fieldwork begins",
  },
  {
    number: "02",
    title: "Demolition",
    companies: "JZ Demolition",
    description: "Prepare the site and execute selective, structural, specialty, concrete, or total demolition scopes.",
    image: "/media/jzg/mob-pompano-demolition.webp",
    imageAlt: "Controlled demolition underway at the MOB Pompano project",
  },
  {
    number: "03",
    title: "Site Logistics",
    companies: "JZ Waste Management",
    description: "Coordinate containers, hauling, fencing, cleanup labor, and material movement around production.",
    image: "/media/jzg/division-waste.webp",
    imageAlt: "JZ Waste Management supporting an active South Florida jobsite",
  },
  {
    number: "04",
    title: "Construction",
    companies: "JZ Construction",
    description: "Lead the project or execute subcontracted trades with visible field coordination and accountability.",
    image: "/media/website-photos/construction-framed-interior.webp",
    imageAlt: "Commercial interior framing progressing through construction",
  },
  {
    number: "05",
    title: "Operations",
    companies: "JZ Development",
    description: "Carry the work through closeout, ownership, property operations, and long-term value.",
    image: "/media/development/workforce-housing-kitchen.webp",
    imageAlt: "Completed interior from a JZ Development property",
  },
] as const;

export function GroupLifecycle() {
  const root = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    element.dataset.enhanced = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) element.dataset.revealed = "true";
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.enhanced;
    };
  }, []);

  return (
    <section className="group-lifecycle" ref={root} aria-labelledby="lifecycle-title" data-active-stage={activeStage}>
      <header><h2 id="lifecycle-title">Every Phase One Group</h2></header>
      <ol aria-label="Project lifecycle stages" tabIndex={0}>
        {stages.map((stage, index) => (
          <li
            data-active={activeStage === index ? "true" : "false"}
            key={stage.number}
            style={{ "--stage-index": index } as CSSProperties}
          >
            <button
              type="button"
              aria-expanded={activeStage === index}
              onClick={() => setActiveStage(index)}
              onFocus={() => setActiveStage(index)}
              onMouseEnter={() => setActiveStage(index)}
            >
              <Image
                className="group-lifecycle-image"
                src={stage.image}
                alt={stage.imageAlt}
                fill
                sizes="(max-width: 900px) 86vw, 42vw"
              />
              <span className="group-lifecycle-shade" aria-hidden="true" />
              <span className="group-lifecycle-number">{stage.number}</span>
              <div className="group-lifecycle-copy">
                <h3>{stage.title}</h3>
                <strong>{stage.companies}</strong>
                <p>{stage.description}</p>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
