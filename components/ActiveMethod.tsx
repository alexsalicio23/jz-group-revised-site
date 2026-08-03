"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { activeMethods, qualificationTopics } from "@/app/presentation-data";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function ActiveMethod() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = activeMethods[activeIndex];

  return (
    <section className="v3-active" id="active-facilities" aria-labelledby="active-title">
      <header className="v3-section-heading v3-section-heading-light">
        <p className="v3-label v3-label-light">Active environments / Safety</p>
        <h2 id="active-title">The building keeps moving.<br />So does the work.</h2>
        <p>Control is the specialty: plan around what remains active, protect the operation, and leave a clean handoff.</p>
      </header>

      <div className="v3-active-stage">
        <div className="v3-method-controls" role="tablist" aria-label="Active facility method">
          {activeMethods.map((method, index) => (
            <button
              aria-controls="active-method-panel"
              aria-selected={activeIndex === index}
              className="v3-method-control"
              id={`active-method-${index}`}
              key={method.title}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              role="tab"
              type="button"
            >
              <span>{method.number}</span>
              <strong>{method.title}</strong>
            </button>
          ))}
        </div>

        <div className="v3-method-panel" id="active-method-panel" role="tabpanel" aria-labelledby={`active-method-${activeIndex}`}>
          <MediaPlaceholder label={active.mediaLabel} inverse />
          <div className="v3-method-panel-copy">
            <p className="v3-label v3-label-light">{active.number} / {active.title}</p>
            <p>{active.description}</p>
            <Link href="/active-facilities">Explore active-facility work <ArrowUpRight aria-hidden="true" size={18} /></Link>
          </div>
        </div>
      </div>

      <div className="v3-qualification-strip" id="safety">
        <p className="v3-label v3-label-light">Qualification priorities</p>
        <div>
          {qualificationTopics.map((topic, index) => (
            <Link href="/safety" key={topic}><span>{String(index + 1).padStart(2, "0")}</span>{topic}<ArrowUpRight aria-hidden="true" size={17} /></Link>
          ))}
        </div>
      </div>
    </section>
  );
}
