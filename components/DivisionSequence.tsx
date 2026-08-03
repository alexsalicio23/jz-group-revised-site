"use client";

import Image from "next/image";
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

      media.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        () => {
          const layers = gsap.utils.toArray<HTMLElement>(".chain-layer");
          const chapters = gsap.utils.toArray<HTMLElement>(".chain-chapter");
          const railItems = gsap.utils.toArray<HTMLElement>(".chain-rail-item");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.35,
            },
          });

          layers.slice(1).forEach((layer) => gsap.set(layer, { autoAlpha: 0 }));
          chapters.slice(1).forEach((chapter) => gsap.set(chapter, { autoAlpha: 0, y: 30 }));
          railItems.slice(1).forEach((item) => gsap.set(item, { opacity: 0.38 }));

          for (let index = 1; index < divisions.length; index += 1) {
            const position = index;
            timeline
              .to(layers[index - 1], { autoAlpha: 0, duration: 0.22 }, position - 0.12)
              .to(layers[index], { autoAlpha: 1, duration: 0.22 }, position - 0.12)
              .to(chapters[index - 1], { autoAlpha: 0, y: -24, duration: 0.18 }, position - 0.12)
              .to(chapters[index], { autoAlpha: 1, y: 0, duration: 0.2 }, position)
              .to(railItems[index - 1], { opacity: 0.38, duration: 0.15 }, position - 0.1)
              .to(railItems[index], { opacity: 1, duration: 0.15 }, position - 0.1);
          }

          timeline.to({}, { duration: 0.8 });
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="chain" id="group" aria-labelledby="chain-title">
      <div className="chain-desktop">
        <div className="chain-layers" aria-hidden="true">
          {divisions.map((division) => (
            <div className="chain-layer" key={division.name}>
              {division.type === "video" ? (
                <video autoPlay muted loop playsInline preload="metadata" poster={division.poster}>
                  <source src={division.media} type="video/mp4" />
                </video>
              ) : (
                <Image src={division.media} alt="" fill sizes="100vw" />
              )}
            </div>
          ))}
          <div className="chain-shade" />
        </div>

        <div className="chain-heading">
          <p className="eyebrow light">One accountable chain</p>
          <h2 id="chain-title">Specialists by trade.<br />Aligned by one standard.</h2>
        </div>

        <div className="chain-chapters">
          {divisions.map((division) => (
            <article className="chain-chapter" key={division.name}>
              <p className="chain-number">{division.number}</p>
              <p className="chain-kicker">{division.kicker}</p>
              <h3>{division.name}</h3>
              <p>{division.description}</p>
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

        <p className="chain-note">
          When scopes overlap, JZ companies coordinate under one group. Development extends the
          lifecycle but is not represented as part of every demolition project.
        </p>
      </div>

      <div className="chain-mobile">
        <div className="chain-mobile-intro">
          <p className="eyebrow light">One accountable chain</p>
          <h2>Specialists by trade. Aligned by one standard.</h2>
        </div>
        {divisions.map((division) => (
          <article className="chain-mobile-stage" key={division.name}>
            <div className="chain-mobile-media">
              {division.type === "video" ? (
                <video aria-hidden="true" muted loop playsInline preload="none" poster={division.poster}>
                  <source src={division.media} type="video/mp4" />
                </video>
              ) : (
                <Image src={division.media} alt="" fill sizes="100vw" />
              )}
            </div>
            <p className="chain-number">{division.number}</p>
            <p className="chain-kicker">{division.kicker}</p>
            <h3>{division.name}</h3>
            <p>{division.description}</p>
          </article>
        ))}
        <p className="chain-note">
          When scopes overlap, JZ companies coordinate under one group. Development extends the
          lifecycle but is not represented as part of every demolition project.
        </p>
      </div>
    </section>
  );
}
