"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
        () => {
          const walkthrough = video.current;
          let videoFrame = 0;
          let timeline: gsap.core.Timeline | undefined;
          let removeSeekListener: (() => void) | undefined;

          const startDesktopExperience = () => {
            if (
              !walkthrough ||
              timeline ||
              !Number.isFinite(walkthrough.duration) ||
              walkthrough.duration <= 0
            ) {
              return;
            }

            walkthrough.pause();
            const openingTime = walkthrough.duration < 14 ? 0 : 2;
            const closingTime = Math.max(openingTime, walkthrough.duration - 0.08);
            const playhead = { time: openingTime };
            const frameDuration = 1 / 24;
            let pendingTime = openingTime;
            let seekInFlight = false;

            walkthrough.currentTime = openingTime;

            const performSeek = () => {
              videoFrame = 0;
              if (seekInFlight) return;

              const frameTime = Math.min(
                closingTime,
                Math.max(openingTime, Math.round(pendingTime / frameDuration) * frameDuration),
              );

              if (Math.abs(walkthrough.currentTime - frameTime) < frameDuration * 0.45) return;

              seekInFlight = true;
              walkthrough.currentTime = frameTime;
            };

            const queueFrame = () => {
              pendingTime = playhead.time;
              if (!seekInFlight && !videoFrame) {
                videoFrame = requestAnimationFrame(performSeek);
              }
            };

            const handleSeeked = () => {
              seekInFlight = false;
              if (
                Math.abs(pendingTime - walkthrough.currentTime) >= frameDuration * 0.7 &&
                !videoFrame
              ) {
                videoFrame = requestAnimationFrame(performSeek);
              }
            };

            walkthrough.addEventListener("seeked", handleSeeked);
            removeSeekListener = () => walkthrough.removeEventListener("seeked", handleSeeked);

            timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.65,
              },
            });

            timeline
              .to(playhead, { time: closingTime, duration: 1, onUpdate: queueFrame }, 0)
              .to(".hero-progress-fill", { scaleX: 1, duration: 1 }, 0)
              .to(".hero-intro", { autoAlpha: 0, y: -36, duration: 0.18 }, 0.14)
              .fromTo(
                ".hero-chapter",
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.14 },
                0.3,
              )
              .to(".hero-chapter", { autoAlpha: 0, y: -20, duration: 0.12 }, 0.64)
              .fromTo(
                ".hero-resolution",
                { autoAlpha: 0, y: 32 },
                { autoAlpha: 1, y: 0, duration: 0.2 },
                0.72,
              );

            ScrollTrigger.refresh();
          };

          if (walkthrough?.readyState && walkthrough.readyState >= 1) {
            startDesktopExperience();
          } else {
            walkthrough?.addEventListener("loadedmetadata", startDesktopExperience, { once: true });
          }

          return () => {
            if (videoFrame) cancelAnimationFrame(videoFrame);
            walkthrough?.removeEventListener("loadedmetadata", startDesktopExperience);
            removeSeekListener?.();
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
          };
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
            ref={video}
            className="hero-video hero-walkthrough"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/media/jz-drone-walkthrough-poster.jpg"
            onLoadedMetadata={(event) => {
              if (window.matchMedia("(max-width: 760px)").matches) {
                event.currentTarget.currentTime = Math.min(2, event.currentTarget.duration - 0.1);
              }
            }}
            onEnded={(event) => {
              event.currentTarget.currentTime = 2;
              void event.currentTarget.play();
            }}
          >
            <source
              src="/media/jz-drone-walkthrough-scrub.mp4"
              type="video/mp4"
              media="(min-width: 761px)"
            />
            <source src="/media/jz-drone-walkthrough.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" />
        </div>

        <div className="hero-intro hero-copy">
          <p className="eyebrow light">JZ Group / Four coordinated companies</p>
          <p className="hero-manifesto">Built around what cannot stop.</p>
          <h1>Specialty demolition in active environments.</h1>
          <p className="hero-support">
            Led by specialty demolition for hospitals, occupied facilities, and complex commercial
            sites where safety, precision, and continuity matter.
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
          <span>Existing office</span>
          <div className="hero-progress"><span className="hero-progress-fill" /></div>
          <span>Ready for work</span>
        </div>
      </div>
    </section>
  );
}
