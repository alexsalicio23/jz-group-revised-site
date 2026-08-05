"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const walkthroughChapters = [
  {
    number: "01",
    title: "Controlled demolition",
    detail: "Selective removal in an active environment.",
    start: 2,
    end: 4.8,
  },
  {
    number: "02",
    title: "Framing",
    detail: "The new plan takes shape.",
    start: 4.8,
    end: 7.5,
  },
  {
    number: "03",
    title: "Drywall and ceiling systems",
    detail: "Interiors rebuilt around the next phase.",
    start: 7.5,
    end: 10.1,
  },
  {
    number: "04",
    title: "Ready for work",
    detail: "A clean turnover for the people coming next.",
    start: 10.1,
    end: 13,
  },
] as const;

function getChapterIndex(time: number) {
  const index = walkthroughChapters.findIndex(
    (chapter) => time >= chapter.start && time < chapter.end,
  );

  return index === -1 ? walkthroughChapters.length - 1 : index;
}

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [activeMobileChapter, setActiveMobileChapter] = useState(0);
  const [mobileHeroState, setMobileHeroState] = useState<"intro" | "chapter" | "resolution">("intro");

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
        () => {
          const walkthrough = video.current;
          const chapterCards = gsap.utils.toArray<HTMLElement>(".hero-chapter", root.current);
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
            const openingTime = Math.min(2, Math.max(0, walkthrough.duration - 0.1));
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

            gsap.set(chapterCards, { autoAlpha: 0, y: 30, scale: 0.98 });

            timeline
              .to(playhead, { time: closingTime, duration: 1, onUpdate: queueFrame }, 0)
              .to(".hero-progress-fill", { scaleX: 1, duration: 1 }, 0)
              .to(".hero-intro", { autoAlpha: 0, y: -28, duration: 0.13 }, 0.1)
              .to(chapterCards[0], { autoAlpha: 1, y: 0, scale: 1, duration: 0.08 }, 0.14)
              .to(chapterCards[0], { autoAlpha: 0, y: -20, duration: 0.06 }, 0.25)
              .to(chapterCards[1], { autoAlpha: 1, y: 0, scale: 1, duration: 0.08 }, 0.26)
              .to(chapterCards[1], { autoAlpha: 0, y: -20, duration: 0.06 }, 0.49)
              .to(chapterCards[2], { autoAlpha: 1, y: 0, scale: 1, duration: 0.08 }, 0.5)
              .to(chapterCards[2], { autoAlpha: 0, y: -20, duration: 0.06 }, 0.73)
              .to(chapterCards[3], { autoAlpha: 1, y: 0, scale: 1, duration: 0.08 }, 0.74)
              .to(chapterCards[3], { autoAlpha: 0, y: -20, duration: 0.06 }, 0.9)
              .fromTo(
                ".hero-resolution",
                { autoAlpha: 0, y: 32 },
                { autoAlpha: 1, y: 0, duration: 0.2 },
                0.9,
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
            onTimeUpdate={(event) => {
              if (window.matchMedia("(max-width: 760px)").matches) {
                const { currentTime } = event.currentTarget;
                const chapterIndex = getChapterIndex(currentTime);
                setActiveMobileChapter((current) =>
                  current === chapterIndex ? current : chapterIndex,
                );
                const nextState =
                  currentTime >= 12.65 ? "resolution" : currentTime >= 3 ? "chapter" : "intro";
                setMobileHeroState((current) => (current === nextState ? current : nextState));
              }
            }}
            onEnded={(event) => {
              event.currentTarget.currentTime = 2;
              setMobileHeroState("intro");
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

        <div className={`hero-intro hero-copy${mobileHeroState !== "intro" ? " is-mobile-hidden" : ""}`}>
          <h1>Specialty demolition in active environments.</h1>
          <div className="hero-actions">
            <a className="button button-light" href="#group">Meet the four companies</a>
          </div>
        </div>

        <aside
          className={`hero-chapters${mobileHeroState === "resolution" ? " is-mobile-hidden" : ""}`}
          aria-label="Walkthrough stages"
        >
          {walkthroughChapters.map((chapter, index) => (
            <article
              className={`hero-chapter${activeMobileChapter === index ? " is-active" : ""}`}
              key={chapter.title}
            >
              <span>{chapter.number} / 04</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.detail}</p>
            </article>
          ))}
        </aside>

        <div className={`hero-resolution hero-copy${mobileHeroState === "resolution" ? " is-mobile-visible" : ""}`}>
          <p className="hero-resolution-title">One group.<br />Four divisions.</p>
        </div>

        <div className="hero-meter" aria-hidden="true">
          <div className="hero-progress"><span className="hero-progress-fill" /></div>
        </div>
      </div>
    </section>
  );
}
