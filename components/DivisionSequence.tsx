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

const arrivalPoints = [0.24, 0.39, 0.54, 0.69] as const;

export function DivisionSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const element = root.current;
        if (!element) return;

        const cards = gsap.utils.toArray<HTMLElement>(".division-stack-card", element);
        const stage = element.querySelector<HTMLElement>(".division-card-deck");
        const heading = element.querySelector<HTMLElement>(".division-stack-heading");
        const progressTrack = element.querySelector<HTMLElement>(".division-stack-progress");
        const progress = element.querySelector<HTMLElement>(".division-stack-progress-fill");
        if (!cards.length || !stage || !heading) return;

        element.dataset.enhanced = "true";

        const getMetrics = () => {
          const gap = Math.max(14, Math.min(24, window.innerWidth * 0.012));
          const sidePadding = Math.max(24, Math.min(64, window.innerWidth * 0.034));
          const available = window.innerWidth - sidePadding * 2 - gap * (cards.length - 1);
          const rowWidth = Math.min(430, available / cards.length);
          const rowHeight = Math.min(500, Math.max(370, window.innerHeight * 0.52));
          const stackWidth = Math.min(460, Math.max(390, window.innerWidth * 0.31));
          const stackHeight = Math.min(520, Math.max(440, window.innerHeight * 0.56));

          return { gap, rowHeight, rowWidth, stackHeight, stackWidth };
        };

        const getRowX = (index: number) => {
          const { gap, rowWidth } = getMetrics();
          return (index - (cards.length - 1) / 2) * (rowWidth + gap);
        };

        gsap.set(stage, { perspective: 1600, transformStyle: "preserve-3d" });
        gsap.set(heading, { y: 34, opacity: 1 });
        if (progressTrack) gsap.set(progressTrack, { opacity: 0 });
        if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: "top" });

        cards.forEach((card, index) => {
          const { stackHeight, stackWidth } = getMetrics();
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: Math.max(420, window.innerHeight * 0.62),
            z: 150,
            width: stackWidth,
            height: stackHeight,
            rotationX: 8,
            rotationY: index % 2 ? 3 : -3,
            rotationZ: index % 2 ? 1.5 : -1.5,
            scale: 0.94,
            opacity: 0.12,
            zIndex: index + 2,
            transformOrigin: "center center",
          });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.34,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(heading, { y: 0, opacity: 1, duration: 0.14, ease: "power3.out" }, 0.06);
        if (progressTrack) timeline.to(progressTrack, { opacity: 1, duration: 0.12, ease: "power2.out" }, 0.04);
        if (progress) timeline.to(progress, { scaleY: 1, duration: 0.9, ease: "none" }, 0.07);

        cards.forEach((card, index) => {
          const arrival = arrivalPoints[index];

          cards.slice(0, index).forEach((previous, previousIndex) => {
            const depth = index - previousIndex;
            timeline.to(
              previous,
              {
                x: (previousIndex % 2 ? 1 : -1) * depth * 30,
                y: -depth * 22,
                z: -depth * 78,
                rotationY: (previousIndex % 2 ? 1 : -1) * depth * 1.6,
                rotationZ: (previousIndex % 2 ? 1 : -1) * depth * 0.65,
                scale: 1 - depth * 0.035,
                filter: `brightness(${Math.max(0.7, 1 - depth * 0.08)})`,
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
              opacity: 1,
              filter: "brightness(1)",
              duration: 0.14,
              ease: "power4.out",
            },
            arrival,
          );
        });

        cards.forEach((card, index) => {
          timeline.to(
            card,
            {
              x: () => getRowX(index),
              y: 20,
              z: 0,
              width: () => getMetrics().rowWidth,
              height: () => getMetrics().rowHeight,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 1,
              opacity: 1,
              filter: "brightness(1)",
              duration: 0.15,
              ease: "power3.inOut",
            },
            0.81,
          );
        });

        timeline.to({}, { duration: 0.03 }, 0.97);
        ScrollTrigger.refresh();

        return () => {
          delete element.dataset.enhanced;
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="division-stack"
      data-pinned-scroll="compact"
      id="companies"
      aria-labelledby="division-stack-title"
    >
      <span className="anchor-target" id="group" aria-hidden="true" />
      <div className="division-stack-pin">
        <header className="division-stack-heading">
          <h2 id="division-stack-title">Four Companies One Group</h2>
        </header>

        <div className="division-card-deck">
          {divisions.map((division) => {
            return (
              <Link className="division-stack-card" href={`/${division.slug}`} key={division.name}>
                <div className="division-card-visual">
                  <Image
                    alt={`${division.name} field operations`}
                    fill
                    sizes="(max-width: 900px) 82vw, (max-width: 1550px) 24vw, 430px"
                    src={division.media}
                  />
                  <span className="division-card-number">{division.number}</span>
                </div>
                <div className="division-card-copy">
                  <h3>{division.name}</h3>
                  <p>{division.description}</p>
                  <span className="division-card-link">
                    Explore company <ArrowUpRight aria-hidden="true" size={17} />
                  </span>
                </div>
              </Link>
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
