"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";

type HeroChapter = {
  number: string;
  title: string;
  detail: string;
  start: number;
  end: number;
  placement: "lower-left" | "upper-right" | "upper-left" | "lower-right";
  motion: "cut" | "frame" | "panels" | "complete";
};

const START_TIME = 2;
const END_TIME = 13;

const chapters = [
  {
    number: "01",
    title: "Controlled demolition",
    detail: "Selective removal planned around an active environment.",
    start: 2,
    end: 4.8,
    placement: "lower-left",
    motion: "cut",
  },
  {
    number: "02",
    title: "Framing",
    detail: "The new floor plan begins taking shape.",
    start: 4.8,
    end: 7.5,
    placement: "upper-right",
    motion: "frame",
  },
  {
    number: "03",
    title: "Drywall and ceiling systems",
    detail: "Interiors are rebuilt around the next phase of work.",
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
] as const satisfies readonly HeroChapter[];

function getChapterIndex(time: number) {
  if (time <= chapters[0].start) return 0;
  const index = chapters.findIndex((chapter) => time >= chapter.start && time < chapter.end);
  return index === -1 ? chapters.length - 1 : index;
}

export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const setActiveChapter = (index: number) => {
    const element = root.current;
    if (!element) return;
    if (element.dataset.chapter === String(index)) return;
    element.dataset.chapter = String(index);

    const chapterElements = Array.from(
      element.querySelectorAll<HTMLElement>(".compact-hero-chapter"),
    );
    chapterElements.forEach((chapter, chapterIndex) => {
      const active = chapterIndex === index;
      chapter.toggleAttribute("data-active", active);
      if (active) chapter.setAttribute("aria-current", "step");
      else {
        chapter.removeAttribute("aria-current");
        const frame = chapter.querySelector<HTMLElement>(".compact-hero-chapter-frame");
        frame?.style.setProperty("--chapter-x", "0px");
        frame?.style.setProperty("--chapter-y", "0px");
        frame?.style.setProperty("--chapter-rx", "0deg");
        frame?.style.setProperty("--chapter-ry", "0deg");
      }
    });

    const activeElement = chapterElements[index];
    if (window.matchMedia("(max-width: 900px)").matches && activeElement) {
      const rail = element.querySelector<HTMLElement>(".compact-hero-chapters");
      rail?.scrollTo({
        left: activeElement.offsetLeft - (rail.clientWidth - activeElement.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  };

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const desktop = window.matchMedia("(min-width: 901px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reducedMotion) element.dataset.enhanced = "true";
  }, []);

  useEffect(() => {
    const element = root.current;
    const walkthrough = video.current;
    if (!element || !walkthrough) return;

    const desktop = window.matchMedia("(min-width: 901px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!desktop || reducedMotion) {
      if (reducedMotion) {
        walkthrough.pause();
        walkthrough.currentTime = START_TIME;
      }
      return;
    }

    let scrollFrame = 0;
    let videoFrame = 0;
    let targetTime = START_TIME;
    let renderedTime = START_TIME;
    const pointerCleanups: Array<() => void> = [];

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const cards = Array.from(element.querySelectorAll<HTMLElement>(".compact-hero-chapter"));

      cards.forEach((card) => {
        const frame = card.querySelector<HTMLElement>(".compact-hero-chapter-frame");
        if (!frame) return;

        let pointerFrame = 0;
        let pointerX = 0;
        let pointerY = 0;

        const renderPointer = () => {
          pointerFrame = 0;
          frame.style.setProperty("--chapter-x", `${pointerX.toFixed(2)}px`);
          frame.style.setProperty("--chapter-y", `${pointerY.toFixed(2)}px`);
          frame.style.setProperty("--chapter-rx", `${(-pointerY * 0.22).toFixed(2)}deg`);
          frame.style.setProperty("--chapter-ry", `${(pointerX * 0.22).toFixed(2)}deg`);
        };

        const handlePointerMove = (event: PointerEvent) => {
          if (!card.hasAttribute("data-active")) return;
          const bounds = card.getBoundingClientRect();
          pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
          pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
          if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
        };

        const handlePointerLeave = () => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame);
          pointerFrame = 0;
          frame.style.setProperty("--chapter-x", "0px");
          frame.style.setProperty("--chapter-y", "0px");
          frame.style.setProperty("--chapter-rx", "0deg");
          frame.style.setProperty("--chapter-ry", "0deg");
        };

        card.addEventListener("pointermove", handlePointerMove, { passive: true });
        card.addEventListener("pointerleave", handlePointerLeave);
        pointerCleanups.push(() => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame);
          card.removeEventListener("pointermove", handlePointerMove);
          card.removeEventListener("pointerleave", handlePointerLeave);
        });
      });
    }

    const renderVideo = () => {
      videoFrame = 0;
      const difference = targetTime - renderedTime;
      renderedTime = Math.abs(difference) < 0.025
        ? targetTime
        : renderedTime + difference * 0.42;

      if (Math.abs(walkthrough.currentTime - renderedTime) > 1 / 48) {
        walkthrough.currentTime = renderedTime;
      }

      if (Math.abs(targetTime - renderedTime) >= 0.025) {
        videoFrame = requestAnimationFrame(renderVideo);
      }
    };

    const update = () => {
      scrollFrame = 0;
      const travel = Math.max(1, element.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - element.offsetTop) / travel));
      targetTime = START_TIME + (END_TIME - START_TIME) * progress;

      element.style.setProperty("--hero-progress", progress.toFixed(4));
      element.dataset.state = progress >= 0.92
        ? "resolution"
        : progress >= 0.1
          ? "chapters"
          : "intro";
      setActiveChapter(getChapterIndex(targetTime));

      if (!videoFrame) videoFrame = requestAnimationFrame(renderVideo);
    };

    const queueUpdate = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(update);
    };

    const prepareVideo = () => {
      walkthrough.pause();
      walkthrough.currentTime = START_TIME;
      renderedTime = START_TIME;
      update();
    };

    if (walkthrough.readyState >= 1) prepareVideo();
    else walkthrough.addEventListener("loadedmetadata", prepareVideo, { once: true });

    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (videoFrame) cancelAnimationFrame(videoFrame);
      walkthrough.removeEventListener("loadedmetadata", prepareVideo);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      pointerCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section
      className="compact-hero"
      data-pinned-scroll="compact"
      data-state="intro"
      id="top"
      ref={root}
      aria-labelledby="home-title"
    >
      <div className="compact-hero-stage">
        <video
          ref={video}
          className="compact-hero-media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/jz-drone-walkthrough-poster.jpg"
          aria-label="A continuous walkthrough of a commercial interior moving from demolition to completion"
          onTimeUpdate={(event) => {
            if (window.matchMedia("(min-width: 901px)").matches) return;
            const currentTime = event.currentTarget.currentTime;
            if (root.current) {
              root.current.dataset.state = currentTime >= END_TIME
                ? "resolution"
                : currentTime >= START_TIME
                  ? "chapters"
                  : "intro";
            }
            setActiveChapter(getChapterIndex(currentTime));
          }}
        >
          <source
            src="/media/jz-drone-walkthrough-scrub.mp4"
            type="video/mp4"
            media="(min-width: 901px)"
          />
          <source src="/media/jz-drone-walkthrough.mp4" type="video/mp4" />
        </video>

        <div className="compact-hero-shade" aria-hidden="true" />

        <div className="compact-hero-intro">
          <p>JZ Group / South Florida</p>
          <h1 id="home-title">Built around<br />what can&apos;t stop.</h1>
          <div className="compact-hero-summary">
            <p>
              Four coordinated companies built for specialty demolition, construction,
              waste management, and development.
            </p>
            <div>
              <Link href="#companies">Explore the group <ArrowUpRight aria-hidden="true" size={17} /></Link>
              <Link href="/contact">Send a scope <ArrowUpRight aria-hidden="true" size={17} /></Link>
            </div>
          </div>
        </div>

        <ol
          className="compact-hero-chapters"
          aria-label="Interior transformation phases"
          tabIndex={0}
        >
          {chapters.map((chapter, index) => (
            <li
              className={`compact-hero-chapter is-${chapter.placement} is-${chapter.motion}`}
              data-active={index === 0 ? "" : undefined}
              data-motion={chapter.motion}
              data-placement={chapter.placement}
              aria-current={index === 0 ? "step" : undefined}
              key={chapter.title}
            >
              <div className="compact-hero-chapter-frame">
                <div className="compact-hero-chapter-structure" aria-hidden="true">
                  <span className="compact-hero-chapter-surface" />
                  <span className="compact-hero-chapter-panel panel-a" />
                  <span className="compact-hero-chapter-panel panel-b" />
                  <span className="compact-hero-chapter-rail rail-top" />
                  <span className="compact-hero-chapter-rail rail-right" />
                  <span className="compact-hero-chapter-rail rail-bottom" />
                  <span className="compact-hero-chapter-rail rail-left" />
                </div>
                <div className="compact-hero-chapter-content">
                  <span>{chapter.number} / 04</span>
                  <strong>{chapter.title}</strong>
                  <p>{chapter.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="compact-hero-resolution" aria-hidden="true">
          <Image src="/media/brand-logo.webp" alt="" width={180} height={90} />
          <i />
          <p>One group.<br />Four divisions.</p>
        </div>

        <div className="compact-hero-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
