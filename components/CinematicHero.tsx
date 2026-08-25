"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";

type HeroChapter = {
  title: string;
  detail: string;
  start: number;
  end: number;
  placement: "lower-left" | "upper-right" | "upper-left" | "lower-right";
};

const START_TIME = 2;
const END_TIME = 13;

// The `media` attribute on <source> is ignored inside <video> by Chromium and
// WebKit: the browser walks the list, discards what it already fetched, and
// lands on the last entry. Shipping three sources meant every visit downloaded
// two full files (13.6 MB desktop / 9.5 MB mobile) and always played the
// desktop cut. Selecting one src at runtime is the only reliable way.
const HERO_VIDEO = {
  mobile: "/media/jz-drone-walkthrough-mobile-v2.mp4",
  desktop: "/media/jz-drone-walkthrough-scrub-v2.mp4",
} as const;

const chapters = [
  {
    title: "Controlled demolition",
    detail: "Selective removal planned around an active environment.",
    start: 2,
    end: 4.8,
    placement: "lower-left",
  },
  {
    title: "Framing",
    detail: "The new floor plan begins taking shape.",
    start: 4.8,
    end: 7.5,
    placement: "upper-right",
  },
  {
    title: "Drywall and ceiling systems",
    detail: "Interiors are rebuilt around the next phase of work.",
    start: 7.5,
    end: 10.1,
    placement: "upper-left",
  },
  {
    title: "Ready for work",
    detail: "A clean turnover for the people coming next.",
    start: 10.1,
    end: 13,
    placement: "lower-right",
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

  useLayoutEffect(() => {
    const walkthrough = video.current;
    if (!walkthrough || walkthrough.src) return;
    walkthrough.src = window.matchMedia("(max-width: 900px)").matches
      ? HERO_VIDEO.mobile
      : HERO_VIDEO.desktop;
  }, []);

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
      else chapter.removeAttribute("aria-current");
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

    let anchorFrame = 0;
    let resetTimer = 0;
    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    window.history.scrollRestoration = "manual";

    if (isReload) {
      if (window.location.hash) {
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    }

    const alignAnchor = () => {
      const anchorId = decodeURIComponent(window.location.hash.slice(1));
      if (!anchorId || anchorId === "top") return;
      if (anchorFrame) cancelAnimationFrame(anchorFrame);
      anchorFrame = requestAnimationFrame(() => {
        anchorFrame = requestAnimationFrame(() => {
          const target = document.getElementById(anchorId);
          if (!target) return;
          const previousBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          document.documentElement.style.scrollBehavior = previousBehavior;
        });
      });
    };

    const resetTop = () => {
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = previousBehavior;
    };

    if (isReload) {
      resetTop();
      anchorFrame = requestAnimationFrame(() => {
        anchorFrame = requestAnimationFrame(resetTop);
      });
      resetTimer = window.setTimeout(resetTop, 180);
      window.addEventListener("pageshow", resetTop);
    } else {
      alignAnchor();
    }
    window.addEventListener("hashchange", alignAnchor);

    const desktop = window.matchMedia("(min-width: 901px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reducedMotion) element.dataset.enhanced = "true";

    return () => {
      if (anchorFrame) cancelAnimationFrame(anchorFrame);
      if (resetTimer) window.clearTimeout(resetTimer);
      window.removeEventListener("pageshow", resetTop);
      window.removeEventListener("hashchange", alignAnchor);
    };
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
          preload="metadata"
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
        />

        <div className="compact-hero-shade" aria-hidden="true" />

        <div className="compact-hero-intro">
          <h1 id="home-title">Built around what can&apos;t stop</h1>
          <div className="compact-hero-summary">
            <p>
              Four coordinated companies built for demolition, general contracting,
              subcontracting, waste management, and development.
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
              className={`compact-hero-chapter is-${chapter.placement}`}
              data-active={index === 0 ? "" : undefined}
              data-placement={chapter.placement}
              aria-current={index === 0 ? "step" : undefined}
              key={chapter.title}
            >
              <div className="compact-hero-chapter-frame">
                <div className="compact-hero-chapter-content">
                  <strong>{chapter.title}</strong>
                  <p>{chapter.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="compact-hero-resolution" aria-hidden="true">
          <Image src="/media/brand-logo.webp" alt="" width={180} height={90} />
        </div>

        <div className="compact-hero-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
