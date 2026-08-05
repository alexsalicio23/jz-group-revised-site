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
                scrub: 1,
              },
            });

            timeline
              .to(playhead, { time: closingTime, duration: 1, onUpdate: queueFrame }, 0)
              .to(".hero-progress-fill", { scaleX: 1, duration: 1 }, 0)
              .to(".hero-intro", { autoAlpha: 0, y: -28, duration: 0.16 }, 0.18)
              .fromTo(
                ".hero-resolution",
                { autoAlpha: 0, y: 32 },
                { autoAlpha: 1, y: 0, duration: 0.2 },
                0.74,
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
          <h1>Specialty demolition in active environments.</h1>
          <div className="hero-actions">
            <a className="button button-light" href="#group">Meet the four companies</a>
          </div>
        </div>

        <div className="hero-resolution hero-copy" aria-hidden="true">
          <p className="eyebrow light">The JZ operating model</p>
          <p className="hero-resolution-title">Four companies.<br />One accountable group.</p>
        </div>

        <div className="hero-meter" aria-hidden="true">
          <div className="hero-progress"><span className="hero-progress-fill" /></div>
        </div>
      </div>
    </section>
  );
}
