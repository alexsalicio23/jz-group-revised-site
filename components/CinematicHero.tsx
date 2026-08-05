"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ChapterPlacement = "lower-left" | "upper-right" | "upper-left" | "lower-right";
type ChapterMotion = "cut" | "frame" | "panels" | "complete";

type WalkthroughChapter = {
  number: string;
  title: string;
  detail: string;
  start: number;
  end: number;
  placement: ChapterPlacement;
  motion: ChapterMotion;
};

const walkthroughChapters = [
  {
    number: "01",
    title: "Controlled demolition",
    detail: "Selective removal in an active environment.",
    start: 2,
    end: 4.8,
    placement: "lower-left",
    motion: "cut",
  },
  {
    number: "02",
    title: "Framing",
    detail: "The new plan takes shape.",
    start: 4.8,
    end: 7.5,
    placement: "upper-right",
    motion: "frame",
  },
  {
    number: "03",
    title: "Drywall and ceiling systems",
    detail: "Interiors rebuilt around the next phase.",
    start: 7.5,
    end: 10.1,
    placement: "upper-left",
    motion: "panels",
  },
  {
    number: "04",
    title: "Ready for work",
    detail: "A clean turnover for the people coming next.",
    start: 10.1,
    end: 13,
    placement: "lower-right",
    motion: "complete",
  },
] as const satisfies readonly WalkthroughChapter[];

type HeroChapterCardProps = {
  chapter: WalkthroughChapter;
  index: number;
  activeMobileChapter: number;
};

function HeroChapterCard({ chapter, index, activeMobileChapter }: HeroChapterCardProps) {
  return (
    <article
      className={`hero-chapter hero-chapter-${chapter.placement} hero-chapter-${chapter.motion}${
        activeMobileChapter === index ? " is-active" : ""
      }`}
      data-motion={chapter.motion}
      data-placement={chapter.placement}
    >
      <div className="hero-chapter-interactive">
        <div className="hero-chapter-structure" aria-hidden="true">
          <span className="hero-chapter-surface" />
          <span className="hero-chapter-rail hero-chapter-rail-top" />
          <span className="hero-chapter-rail hero-chapter-rail-right" />
          <span className="hero-chapter-rail hero-chapter-rail-bottom" />
          <span className="hero-chapter-rail hero-chapter-rail-left" />
        </div>
        <div className="hero-chapter-content">
          <span>{chapter.number} / 04</span>
          <h2>{chapter.title}</h2>
          <p>{chapter.detail}</p>
        </div>
      </div>
    </article>
  );
}

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
          const supportsPointerDepth = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
          let videoFrame = 0;
          let timeline: gsap.core.Timeline | undefined;
          let removeSeekListener: (() => void) | undefined;
          let activePointerChapter = -1;
          const hoverCleanups: Array<() => void> = [];

          const resetPointerDepth = (card: HTMLElement, animate = true) => {
            const interactive = card.querySelector<HTMLElement>(".hero-chapter-interactive");
            if (!interactive) return;

            const values = {
              "--pointer-x": "0px",
              "--pointer-y": "0px",
              "--pointer-rotate-x": "0deg",
              "--pointer-rotate-y": "0deg",
              "--pointer-detail-x": "0px",
            };

            if (animate) {
              gsap.to(interactive, { ...values, duration: 0.45, ease: "power3.out", overwrite: true });
            } else {
              Object.entries(values).forEach(([property, value]) => interactive.style.setProperty(property, value));
            }
          };

          const setActivePointerChapter = (nextIndex: number) => {
            if (activePointerChapter === nextIndex) return;

            chapterCards.forEach((card, index) => {
              const isActive = index === nextIndex;
              card.toggleAttribute("data-active", isActive);
              card.style.pointerEvents = isActive && supportsPointerDepth ? "auto" : "none";
              if (!isActive) resetPointerDepth(card);
            });

            activePointerChapter = nextIndex;
          };

          if (supportsPointerDepth) {
            chapterCards.forEach((card) => {
              const interactive = card.querySelector<HTMLElement>(".hero-chapter-interactive");
              if (!interactive) return;

              let pointerFrame = 0;
              let pointerX = 0;
              let pointerY = 0;

              const applyPointerDepth = () => {
                pointerFrame = 0;
                interactive.style.setProperty("--pointer-x", `${pointerX.toFixed(2)}px`);
                interactive.style.setProperty("--pointer-y", `${pointerY.toFixed(2)}px`);
                interactive.style.setProperty("--pointer-rotate-x", `${(-pointerY * 0.25).toFixed(2)}deg`);
                interactive.style.setProperty("--pointer-rotate-y", `${(pointerX * 0.25).toFixed(2)}deg`);
                interactive.style.setProperty("--pointer-detail-x", `${(pointerX * 0.45).toFixed(2)}px`);
              };

              const handlePointerMove = (event: PointerEvent) => {
                if (!card.hasAttribute("data-active")) return;
                const bounds = card.getBoundingClientRect();
                pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
                pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

                if (!pointerFrame) pointerFrame = requestAnimationFrame(applyPointerDepth);
              };

              const handlePointerLeave = () => {
                if (pointerFrame) cancelAnimationFrame(pointerFrame);
                pointerFrame = 0;
                resetPointerDepth(card);
              };

              resetPointerDepth(card, false);
              card.addEventListener("pointermove", handlePointerMove, { passive: true });
              card.addEventListener("pointerleave", handlePointerLeave);
              hoverCleanups.push(() => {
                if (pointerFrame) cancelAnimationFrame(pointerFrame);
                card.removeEventListener("pointermove", handlePointerMove);
                card.removeEventListener("pointerleave", handlePointerLeave);
              });
            });
          }

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
            const storyEndTime = Math.min(13, closingTime);
            const storyDuration = Math.max(0.1, storyEndTime - openingTime);
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

            const desktopTimeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.75,
              },
            });
            timeline = desktopTimeline;

            desktopTimeline
              .to(playhead, { time: closingTime, duration: 1, onUpdate: queueFrame }, 0)
              .to(".hero-progress-fill", { scaleX: 1, duration: 1 }, 0)
              .to(".hero-intro", { autoAlpha: 0, y: -24, duration: 0.075 }, 0.055);

            const chapterRanges = walkthroughChapters.map((chapter, index) => {
              const rawStart = Math.max(0, (chapter.start - openingTime) / storyDuration);
              const normalizedEnd = Math.min(
                1,
                (Math.min(chapter.end, storyEndTime) - openingTime) / storyDuration,
              );
              const end = index === walkthroughChapters.length - 1
                ? Math.min(0.905, normalizedEnd)
                : normalizedEnd;
              const enterStart = index === 0 ? Math.max(0.105, rawStart) : rawStart;
              const rangeDuration = Math.max(0.08, end - rawStart);
              const enterDuration = rangeDuration * 0.2;
              const exitDuration = rangeDuration * 0.2;
              const exitStart = end - exitDuration;

              return { enterStart, enterDuration, exitStart, exitDuration, end };
            });

            chapterCards.forEach((card, index) => {
              const motion = card.dataset.motion as ChapterMotion;
              const content = card.querySelector<HTMLElement>(".hero-chapter-content");
              const surface = card.querySelector<HTMLElement>(".hero-chapter-surface");
              const rails = gsap.utils.toArray<HTMLElement>(".hero-chapter-rail", card);
              const range = chapterRanges[index];
              if (!content || !surface || !range) return;

              const entryTransforms: Record<ChapterMotion, gsap.TweenVars> = {
                cut: { x: -18, y: 12, scale: 0.99 },
                frame: { x: 18, y: -12, scale: 0.99 },
                panels: { x: -14, y: -12, scale: 0.99 },
                complete: { x: 18, y: 12, scale: 0.99 },
              };
              const exitTransforms: Record<ChapterMotion, gsap.TweenVars> = {
                cut: { x: -12, y: -4, scale: 0.995 },
                frame: { x: 12, y: -8, scale: 0.995 },
                panels: { x: -8, y: -10, scale: 0.995 },
                complete: { x: 12, y: 4, scale: 1.01 },
              };

              gsap.set(card, { autoAlpha: 0, pointerEvents: "none", ...entryTransforms[motion] });
              gsap.set(content, { autoAlpha: 0 });

              desktopTimeline.to(
                card,
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: range.enterDuration,
                  ease: "power3.out",
                },
                range.enterStart,
              );

              if (motion === "cut") {
                gsap.set(surface, { clipPath: "inset(0 100% 0 0)" });
                gsap.set(content, { x: -14 });
                gsap.set(rails[3], { scaleY: 0, transformOrigin: "top center" });
                desktopTimeline
                  .to(rails[3], { scaleY: 1, duration: range.enterDuration * 0.58, ease: "power2.out" }, range.enterStart)
                  .to(surface, { clipPath: "inset(0 0% 0 0)", duration: range.enterDuration * 0.82, ease: "power3.out" }, range.enterStart + range.enterDuration * 0.08)
                  .to(content, { autoAlpha: 1, x: 0, duration: range.enterDuration * 0.62, ease: "power2.out" }, range.enterStart + range.enterDuration * 0.28)
                  .to(content, { autoAlpha: 0, x: -10, duration: range.exitDuration * 0.56, ease: "power2.in" }, range.exitStart)
                  .to(surface, { clipPath: "inset(0 0 0 100%)", duration: range.exitDuration * 0.8, ease: "power3.in" }, range.exitStart + range.exitDuration * 0.08)
                  .to(rails[3], { scaleY: 0, transformOrigin: "bottom center", duration: range.exitDuration * 0.46 }, range.exitStart + range.exitDuration * 0.48);
              }

              if (motion === "frame") {
                gsap.set(surface, { clipPath: "inset(0 0 100% 0)" });
                gsap.set(content, { y: 16 });
                gsap.set([rails[0], rails[2]], { scaleX: 0 });
                gsap.set([rails[1], rails[3]], { scaleY: 0 });
                desktopTimeline
                  .to([rails[0], rails[2]], { scaleX: 1, duration: range.enterDuration * 0.7, ease: "power2.out" }, range.enterStart)
                  .to([rails[1], rails[3]], { scaleY: 1, duration: range.enterDuration * 0.7, ease: "power2.out" }, range.enterStart + range.enterDuration * 0.1)
                  .to(surface, { clipPath: "inset(0 0 0% 0)", duration: range.enterDuration * 0.78, ease: "power3.out" }, range.enterStart + range.enterDuration * 0.12)
                  .to(content, { autoAlpha: 1, y: 0, duration: range.enterDuration * 0.58, ease: "power2.out" }, range.enterStart + range.enterDuration * 0.3)
                  .to(content, { autoAlpha: 0, y: -10, duration: range.exitDuration * 0.54, ease: "power2.in" }, range.exitStart)
                  .to([rails[0], rails[2]], { scaleX: 0, duration: range.exitDuration * 0.64, ease: "power2.in" }, range.exitStart + range.exitDuration * 0.18)
                  .to([rails[1], rails[3]], { scaleY: 0, duration: range.exitDuration * 0.64, ease: "power2.in" }, range.exitStart + range.exitDuration * 0.18);
              }

              if (motion === "panels") {
                gsap.set(surface, { clipPath: "inset(0 50% 0 50%)" });
                gsap.set(content, { y: 14 });
                gsap.set(rails[0], { xPercent: -108 });
                gsap.set(rails[2], { xPercent: 108 });
                desktopTimeline
                  .to([rails[0], rails[2]], { xPercent: 0, duration: range.enterDuration * 0.72, ease: "power3.out" }, range.enterStart)
                  .to(surface, { clipPath: "inset(0 0% 0 0%)", duration: range.enterDuration * 0.78, ease: "power3.out" }, range.enterStart + range.enterDuration * 0.1)
                  .to(content, { autoAlpha: 1, y: 0, duration: range.enterDuration * 0.58, ease: "power2.out" }, range.enterStart + range.enterDuration * 0.3)
                  .to(content, { autoAlpha: 0, y: -10, duration: range.exitDuration * 0.54, ease: "power2.in" }, range.exitStart)
                  .to(rails[0], { xPercent: -108, duration: range.exitDuration * 0.7, ease: "power3.in" }, range.exitStart + range.exitDuration * 0.16)
                  .to(rails[2], { xPercent: 108, duration: range.exitDuration * 0.7, ease: "power3.in" }, range.exitStart + range.exitDuration * 0.16)
                  .to(surface, { clipPath: "inset(0 50% 0 50%)", duration: range.exitDuration * 0.68 }, range.exitStart + range.exitDuration * 0.22);
              }

              if (motion === "complete") {
                gsap.set(surface, { clipPath: "inset(0 100% 0 0)" });
                gsap.set(content, { x: 20 });
                gsap.set(rails[1], { scaleY: 0, transformOrigin: "top center" });
                desktopTimeline
                  .to(surface, { clipPath: "inset(0 0% 0 0)", duration: range.enterDuration * 0.82, ease: "power3.out" }, range.enterStart)
                  .to(rails[1], { scaleY: 1, duration: range.enterDuration * 0.64, ease: "power2.out" }, range.enterStart + range.enterDuration * 0.14)
                  .to(content, { autoAlpha: 1, x: 0, duration: range.enterDuration * 0.58, ease: "power2.out" }, range.enterStart + range.enterDuration * 0.3)
                  .to(content, { autoAlpha: 0, x: 10, duration: range.exitDuration * 0.54, ease: "power2.in" }, range.exitStart)
                  .to(surface, { clipPath: "inset(0 0 0 100%)", duration: range.exitDuration * 0.78, ease: "power3.in" }, range.exitStart + range.exitDuration * 0.1)
                  .to(rails[1], { scaleY: 0, transformOrigin: "bottom center", duration: range.exitDuration * 0.5 }, range.exitStart + range.exitDuration * 0.4);
              }

              desktopTimeline.to(
                card,
                {
                  autoAlpha: 0,
                  ...exitTransforms[motion],
                  duration: range.exitDuration * 0.52,
                  ease: "power2.in",
                },
                range.exitStart + range.exitDuration * 0.48,
              );
            });

            desktopTimeline
              .set(".hero-resolution", { autoAlpha: 0 }, 0)
              .set(".hero-resolution-logo", { autoAlpha: 0, scale: 0.86, y: 18 }, 0)
              .set(".hero-resolution-rule", { scaleX: 0 }, 0)
              .set(".hero-resolution-title", { autoAlpha: 0, y: 26 }, 0)
              .fromTo(
                ".hero-resolution",
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.015 },
                0.915,
              )
              .to(
                ".hero-resolution-logo",
                { autoAlpha: 1, scale: 1, y: 0, duration: 0.06, ease: "power3.out" },
                0.92,
              )
              .to(
                ".hero-resolution-rule",
                { scaleX: 1, duration: 0.045, ease: "power2.out" },
                0.94,
              )
              .to(
                ".hero-resolution-title",
                { autoAlpha: 1, y: 0, duration: 0.055, ease: "power3.out" },
                0.945,
              );

            desktopTimeline.eventCallback("onUpdate", () => {
              const timelinePosition = desktopTimeline.time();
              const nextIndex = chapterRanges.findIndex(
                (range) => timelinePosition >= range.enterStart && timelinePosition < range.end,
              );
              setActivePointerChapter(nextIndex);
            });

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
            hoverCleanups.forEach((cleanup) => cleanup());
            chapterCards.forEach((card) => {
              card.removeAttribute("data-active");
              card.style.removeProperty("pointer-events");
            });
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
          className={`hero-chapters${mobileHeroState !== "chapter" ? " is-mobile-hidden" : ""}`}
          aria-label="Walkthrough stages"
        >
          {walkthroughChapters.map((chapter, index) => (
            <HeroChapterCard
              activeMobileChapter={activeMobileChapter}
              chapter={chapter}
              index={index}
              key={chapter.title}
            />
          ))}
        </aside>

        <div className={`hero-resolution${mobileHeroState === "resolution" ? " is-mobile-visible" : ""}`}>
          <div className="hero-resolution-lockup">
            <Image
              className="hero-resolution-logo"
              src="/media/brand-logo.webp"
              alt="JZ Group"
              width={196}
              height={196}
              sizes="196px"
            />
            <span className="hero-resolution-rule" aria-hidden="true" />
            <p className="hero-resolution-title">One group.<br />Four divisions.</p>
          </div>
        </div>

        <div className="hero-meter" aria-hidden="true">
          <div className="hero-progress"><span className="hero-progress-fill" /></div>
        </div>
      </div>
    </section>
  );
}
