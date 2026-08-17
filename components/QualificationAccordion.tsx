"use client";

import { useEffect, useRef, useState } from "react";
import { qualificationRecords } from "@/app/data";

export function QualificationAccordion() {
  const precisePointer = useRef(false);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      precisePointer.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className="metric-qualification-list">
      {qualificationRecords.map((record, index) => {
        const open = openIndex === index;
        const panelId = `qualification-panel-${index}`;
        const triggerId = `qualification-trigger-${index}`;

        return (
          <article
            className="qualification-item"
            data-open={open ? "true" : "false"}
            key={record.title}
            onPointerEnter={() => {
              if (precisePointer.current) setOpenIndex(index);
            }}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                id={triggerId}
                onClick={() => setOpenIndex(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{record.title}</strong>
                <i aria-hidden="true">+</i>
              </button>
            </h3>
            <div
              aria-labelledby={triggerId}
              className="qualification-panel"
              id={panelId}
              role="region"
            >
              <div><p>{record.description}</p></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
