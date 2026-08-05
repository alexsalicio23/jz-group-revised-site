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

        const getOpenRow = () => {
          const gap = Math.max(16, Math.min(24, window.innerWidth * 0.012));
          const sidePadding = Math.max(24, Math.min(68, window.innerWidth * 0.035));
          const availableWidth = window.innerWidth - sidePadding * 2 - gap * (cards.length - 1);
          const width = Math.min(460, window.innerWidth * 0.23, availableWidth / cards.length);
          const height = Math.min(520, Math.max(430, window.innerHeight * 0.52));

          return { gap, height, width };
        };

        const getOpenRowX = (index: number) => {
          const { gap, width } = getOpenRow();
          return (index - (cards.length - 1) / 2) * (width + gap);
        };

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

        const arrivals = [0.12, 0.29, 0.46, 0.63];

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

        cards.forEach((card, index) => {
          timeline.to(
            card,
            {
              x: () => getOpenRowX(index),
              y: 0,
              z: 0,
              width: () => getOpenRow().width,
              height: () => getOpenRow().height,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              autoAlpha: 1,
              filter: "brightness(1)",
              duration: 0.15,
              ease: "power3.inOut",
            },
            0.81,
          );
        });

        timeline.to({}, { duration: 0.04 }, 0.96);
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
