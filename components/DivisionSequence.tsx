"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { divisions } from "@/app/data";
import {
  ActionCircle,
  CircleTransitionLink,
  MediaTilt,
  type RevealTone,
} from "@/components/MotionSystem";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const divisionTone: Record<string, RevealTone> = {
  demolition: "demolition",
  construction: "construction",
  "waste-management": "waste-management",
  development: "development",
};

export function DivisionSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".division-stack-card", root.current);
        const headingLines = gsap.utils.toArray<HTMLElement>(".division-heading-line > span", root.current);
        const progress = root.current?.querySelector<HTMLElement>(".division-stack-progress-fill");
        const stage = root.current?.querySelector<HTMLElement>(".division-card-deck");
        if (!cards.length || !stage) return;

        gsap.set(stage, { perspective: 1500, transformStyle: "preserve-3d" });
        gsap.set(headingLines, { yPercent: 115, opacity: 0 });
        if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: "top" });

        cards.forEach((card, index) => {
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: index % 2 ? 34 : -34,
            y: () => Math.max(520, window.innerHeight * 0.76),
            z: 180,
            rotationX: 9,
            rotationY: index % 2 ? 4 : -4,
            rotationZ: index % 2 ? 2.4 : -2.4,
            scale: 0.96,
            autoAlpha: 0,
            zIndex: index + 2,
            transformOrigin: "center center",
          });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.48,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          headingLines,
          { yPercent: 0, opacity: 1, duration: 0.11, stagger: 0.025, ease: "power3.out" },
          0.015,
        );

        if (progress) timeline.to(progress, { scaleY: 1, duration: 0.86, ease: "none" }, 0.1);

        const arrivals = [0.14, 0.34, 0.54, 0.74];

        cards.forEach((card, index) => {
          const arrival = arrivals[index];

          cards.slice(0, index).forEach((previous, previousIndex) => {
            const depth = index - previousIndex;
            timeline.to(
              previous,
              {
                x: (previousIndex % 2 ? 1 : -1) * depth * 9,
                y: -depth * 24,
                z: -depth * 82,
                rotationX: -depth * 0.8,
                rotationY: (previousIndex % 2 ? 1 : -1) * depth * 1.1,
                rotationZ: (previousIndex % 2 ? 1 : -1) * depth * 0.8,
                scale: 1 - depth * 0.035,
                filter: `brightness(${Math.max(0.68, 1 - depth * 0.09)})`,
                duration: 0.12,
              },
              arrival,
            );
          });

          timeline.to(
            card,
            {
              x: 0,
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              autoAlpha: 1,
              filter: "brightness(1)",
              duration: 0.15,
              ease: "power4.out",
            },
            arrival,
          );
        });

        timeline.to({}, { duration: 0.12 }, 0.88);
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="division-stack" id="companies" aria-labelledby="division-stack-title">
      <span className="anchor-target" id="group" aria-hidden="true" />
      <div className="division-stack-pin">
        <header className="division-stack-heading">
          <h2 id="division-stack-title">
            <span className="division-heading-line"><span>Four companies.</span></span>
            <span className="division-heading-line"><span>One operating group.</span></span>
          </h2>
        </header>

        <div className="division-card-deck">
          {divisions.map((division) => {
            const media = division.type === "video" ? division.poster : division.media;

            return (
              <CircleTransitionLink
                className="division-stack-card"
                href={`/${division.slug}`}
                key={division.name}
                tone={divisionTone[division.slug]}
                ariaLabel={`Explore ${division.name}`}
              >
                <MediaTilt className="division-card-depth">
                  <div className="division-card-visual">
                    <Image
                      alt={`${division.name} field operations`}
                      fill
                      sizes="(max-width: 900px) 84vw, 450px"
                      src={media}
                    />
                    <span className="division-card-number">{division.number}</span>
                    <h3>{division.short}</h3>
                  </div>
                  <div className="division-card-copy">
                    <p>{division.description}</p>
                    <span className="division-card-link">Explore company</span>
                    <ActionCircle />
                  </div>
                </MediaTilt>
              </CircleTransitionLink>
            );
          })}
        </div>

        <div className="division-stack-progress" aria-hidden="true">
          <span className="division-stack-progress-fill" />
        </div>
      </div>
    </section>
  );
}
