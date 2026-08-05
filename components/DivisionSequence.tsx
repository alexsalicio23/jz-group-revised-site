"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { divisions } from "@/app/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stackedPositions = [
  { y: 64, z: -210, rotationY: -16, rotationZ: -4, scale: 0.82 },
  { y: 24, z: -72, rotationY: -7, rotationZ: -1.5, scale: 0.91 },
  { y: -20, z: 54, rotationY: 6, rotationZ: 1.5, scale: 1 },
  { y: -62, z: 158, rotationY: 14, rotationZ: 4, scale: 0.9 },
] as const;

export function DivisionSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".division-stack-card", root.current);
        const heading = root.current?.querySelector<HTMLElement>(".division-stack-heading");
        const headingLines = gsap.utils.toArray<HTMLElement>(".division-heading-line > span", root.current);
        const headingRule = root.current?.querySelector<HTMLElement>(".division-heading-rule");

        const getRowPosition = (index: number) => {
          const width = cards[0]?.offsetWidth ?? 0;
          const gap = Math.max(16, Math.min(26, width * 0.06));

          return (index - (cards.length - 1) / 2) * (width + gap);
        };

        const positionCardsInStack = () => {
          cards.forEach((card, index) => {
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              x: getRowPosition(index),
              ...stackedPositions[index],
              y: stackedPositions[index].y + 42,
              autoAlpha: 0,
            });
          });
        };

        positionCardsInStack();
        if (heading) {
          gsap.set(heading, {
            y: () => Math.min(240, window.innerHeight * 0.24),
            scale: 1.06,
          });
        }
        gsap.set(headingLines, { opacity: 0, yPercent: 112 });
        if (headingRule) gsap.set(headingRule, { scaleX: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });

        if (heading) {
          timeline.to(
            headingLines,
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.14,
              stagger: 0.035,
              ease: "power3.out",
            },
            0.025,
          );

          if (headingRule) {
            timeline.to(
              headingRule,
              { scaleX: 1, duration: 0.1, ease: "power2.out" },
              0.09,
            );
          }

          timeline.to(
            heading,
            { y: 0, scale: 1, duration: 0.2, ease: "power3.inOut" },
            0.17,
          );
        }

        cards.forEach((card, index) => {
          timeline.to(
            card,
            {
              x: () => getRowPosition(index),
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.3,
            },
            0.2 + index * 0.125,
          );
        });

        timeline.to({}, { duration: 0.12 });
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="division-stack" id="group" aria-labelledby="division-stack-title">
      <div className="division-stack-pin">
        <header className="division-stack-heading">
          <h2 id="division-stack-title">
            <span className="division-heading-line"><span>Four companies.</span></span>
            <span className="division-heading-line"><span>One operating group.</span></span>
          </h2>
          <span className="division-heading-rule" aria-hidden="true" />
        </header>

        <div className="division-card-deck">
          {divisions.map((division) => {
            const media = division.type === "video" ? division.poster : division.media;

            return (
              <Link className="division-stack-card" href={`/${division.slug}`} key={division.name}>
                <div className="division-card-visual">
                  <Image
                    alt=""
                    fill
                    sizes="(max-width: 900px) 84vw, (max-width: 1550px) 23vw, 460px"
                    src={media}
                  />
                  <span className="division-card-number">{division.number}</span>
                  <h3>{division.short}</h3>
                </div>
                <div className="division-card-copy">
                  <p>{division.description}</p>
                  <span className="division-card-link">
                    Learn more <ArrowUpRight aria-hidden="true" size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
