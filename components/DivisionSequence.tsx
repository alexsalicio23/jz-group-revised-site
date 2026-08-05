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

export function DivisionSequence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const stages = gsap.utils.toArray<HTMLElement>(".chain-stage");
        const railItems = gsap.utils.toArray<HTMLElement>(".chain-rail-item");
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.32,
          },
        });

        stages.slice(1).forEach((stage) => gsap.set(stage, { autoAlpha: 0 }));
        railItems.slice(1).forEach((item) => gsap.set(item, { opacity: 0.38 }));

        stages.slice(1).forEach((stage, index) => {
          const position = index + 1;
          timeline
            .to(stages[index], { autoAlpha: 0, duration: 0.24 }, position - 0.16)
            .to(stage, { autoAlpha: 1, duration: 0.24 }, position - 0.04)
            .to(railItems[index], { opacity: 0.38, duration: 0.12 }, position - 0.1)
            .to(railItems[position], { opacity: 1, duration: 0.12 }, position - 0.1);
        });

        timeline.to({}, { duration: 0.45 });
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="chain" id="group" aria-labelledby="chain-title">
      <div className="chain-pin">
        <header className="chain-heading">
          <h2 id="chain-title">Four companies.<br />One operating group.</h2>
        </header>

        <div className="chain-stages">
          {divisions.map((division) => (
            <article className="chain-stage" key={division.name}>
              <div className="chain-stage-media" aria-hidden="true">
                {division.type === "video" ? (
                  <video autoPlay muted loop playsInline preload="metadata" poster={division.poster}>
                    <source src={division.media} type="video/mp4" />
                  </video>
                ) : (
                  <Image src={division.media} alt="" fill sizes="100vw" />
                )}
                <div className="chain-shade" />
              </div>
              <div className="chain-stage-copy">
                <h3>{division.name}</h3>
                <p>{division.description}</p>
                <Link className="chain-stage-link" href={`/${division.slug}`}>
                  Explore {division.short} <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <ol className="chain-rail" aria-hidden="true">
          {divisions.map((division) => (
            <li className="chain-rail-item" key={division.name}>
              <span>{division.number}</span>{division.short}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
