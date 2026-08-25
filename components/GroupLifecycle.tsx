"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const stages = [
  {
    number: "01",
    title: "Preconstruction",
    companies: "JZ Development + JZ Construction",
    description: "Evaluate the opportunity, define the delivery path, and align the project before fieldwork begins.",
  },
  {
    number: "02",
    title: "Demolition",
    companies: "JZ Demolition",
    description: "Prepare the site and execute selective, structural, specialty, concrete, or total demolition scopes.",
  },
  {
    number: "03",
    title: "Site Logistics",
    companies: "JZ Waste Management",
    description: "Coordinate containers, hauling, fencing, cleanup labor, and material movement around production.",
  },
  {
    number: "04",
    title: "Construction",
    companies: "JZ Construction",
    description: "Lead the project or execute subcontracted trades with visible field coordination and accountability.",
  },
  {
    number: "05",
    title: "Operations",
    companies: "JZ Development",
    description: "Carry the work through closeout, ownership, property operations, and long-term value.",
  },
] as const;

export function GroupLifecycle() {
  const root = useRef<HTMLElement>(null);

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
    <section className="group-lifecycle" ref={root} aria-labelledby="lifecycle-title">
      <header><h2 id="lifecycle-title">Every Phase One Group</h2></header>
      <ol>
        {stages.map((stage, index) => (
          <li key={stage.number} style={{ "--stage-index": index } as CSSProperties}>
            <span>{stage.number}</span>
            <h3>{stage.title}</h3>
            <strong>{stage.companies}</strong>
            <p>{stage.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
