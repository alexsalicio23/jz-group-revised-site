"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
        () => {
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          });

          timeline
            .to(".hero-progress-fill", { scaleX: 1, duration: 1 }, 0)
            .to(".hero-intro", { autoAlpha: 0, y: -36, duration: 0.18 }, 0.14)
            .fromTo(
              ".hero-chapter",
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.14 },
              0.3,
            )
            .to(
              ".hero-complete",
              { clipPath: "inset(0 0% 0 0)", duration: 0.46 },
              0.3,
            )
            .to(".hero-chapter", { autoAlpha: 0, y: -20, duration: 0.12 }, 0.64)
            .fromTo(
              ".hero-resolution",
              { autoAlpha: 0, y: 32 },
              { autoAlpha: 1, y: 0, duration: 0.2 },
              0.72,
            );
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="cinematic-hero" id="top" aria-label="JZ Group introduction">
      <div className="hero-sticky">
        <div className="hero-media" aria-hidden="true">
          <video
            className="hero-video hero-demolition"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/media/video/hero-demolition-poster.jpg"
          >
            <source
              src="/media/video/hero-demolition-mobile.mp4"
              type="video/mp4"
              media="(max-width: 760px)"
            />
            <source src="/media/video/hero-demolition.mp4" type="video/mp4" />
          </video>
          <div className="hero-complete">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/video/hero-medical-poster.jpg"
            >
              <source src="/media/video/hero-medical.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-shade" />
        </div>

        <div className="hero-intro hero-copy">
          <p className="eyebrow light">South Florida / Specialty contractor</p>
          <p className="hero-manifesto">Built around what cannot stop.</p>
          <h1>Specialty demolition in active environments.</h1>
          <p className="hero-support">
            Hospitals, occupied facilities, and complex commercial sites where safety, precision,
            and continuity matter.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#projects">View active-facility work</a>
            <a className="button button-ghost" href="#qualifications">Review qualifications</a>
          </div>
        </div>

        <div className="hero-chapter hero-copy" aria-hidden="true">
          <p className="eyebrow light">Across JZ projects</p>
          <p className="hero-chapter-title">From controlled removal to a work-ready environment.</p>
        </div>

        <div className="hero-resolution hero-copy" aria-hidden="true">
          <p className="eyebrow light">The operating model</p>
          <p className="hero-resolution-title">One group.<br />One accountable workflow.</p>
          <p className="hero-disclosure">A capability journey across multiple JZ projects.</p>
        </div>

        <div className="hero-meter" aria-hidden="true">
          <span>Demolition</span>
          <div className="hero-progress"><span className="hero-progress-fill" /></div>
          <span>Ready for work</span>
        </div>
      </div>
    </section>
  );
}
