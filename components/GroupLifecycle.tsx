"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const stages = [
  {
    number: "01",
    title: "Opportunity And Preconstruction",
    companies: "JZ Development + JZ Construction",
    description: "Evaluate the opportunity, define the delivery path, and align the project before fieldwork begins.",
  },
  {
    number: "02",
    title: "Site Preparation And Demolition",
    companies: "JZ Demolition",
    description: "Prepare the site and execute selective, structural, specialty, concrete, or total demolition scopes.",
  },
  {
    number: "03",
    title: "Hauling And Site Logistics",
    companies: "JZ Waste Management",
    description: "Coordinate containers, hauling, fencing, cleanup labor, and material movement around production.",
  },
  {
    number: "04",
    title: "General Contracting And Construction",
    companies: "JZ Construction",
    description: "Lead the project or execute subcontracted trades with visible field coordination and accountability.",
  },
  {
    number: "05",
    title: "Completion And Long-Term Operations",
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
      <header><h2 id="lifecycle-title">One Group Across The Project Lifecycle</h2></header>
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
