"use client";

import { Pause, Play } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./ResponsiveVideoMotion.module.css";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function serverMotionPreference() {
  return true;
}

/**
 * Continuous background media only, not scroll-driven or user-controlled players.
 * Select one encode after hydration; reduced motion and no-JS keep the poster.
 */
export function ResponsiveVideo({
  src,
  mobileSrc,
  mobileQuery = "(max-width: 760px)",
  poster,
  className,
  ariaLabel,
  preload = "metadata",
}: {
  src: string;
  mobileSrc?: string;
  mobileQuery?: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
  preload?: "none" | "metadata" | "auto";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const selectedSource = useRef<{
    src: string;
    mobileSrc?: string;
    mobileQuery: string;
    selected: string;
  } | null>(null);
  const userPaused = useRef(false);
  const syncPlayback = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);
  const videoId = useId();
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    serverMotionPreference,
  );

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.pause();
      if (el.hasAttribute("src")) {
        // Reset to the poster, not an arbitrary frozen frame from prior playback.
        el.removeAttribute("src");
        el.load();
      }
      return;
    }

    const previous = selectedSource.current;
    if (!previous || previous.src !== src || previous.mobileSrc !== mobileSrc || previous.mobileQuery !== mobileQuery) {
      selectedSource.current = {
        src,
        mobileSrc,
        mobileQuery,
        selected: mobileSrc && window.matchMedia(mobileQuery).matches ? mobileSrc : src,
      };
    }
    const selected = selectedSource.current!.selected;
    if (el.getAttribute("src") !== selected) el.src = selected;

    let disposed = false;
    let inViewport = !("IntersectionObserver" in window);
    const shouldPlay = () => !disposed && inViewport && !document.hidden && !userPaused.current;
    const updatePlayback = () => {
      if (!shouldPlay()) {
        el.pause();
      } else if (el.paused) {
        void el.play().then(() => {
          if (!shouldPlay()) el.pause();
        }).catch(() => {
          // Autoplay can be denied; the resume button remains available.
        });
      }
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting;
        updatePlayback();
      }, { threshold: 0 })
      : null;

    syncPlayback.current = updatePlayback;
    observer?.observe(el);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();

    return () => {
      disposed = true;
      syncPlayback.current = null;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      el.pause();
    };
  }, [src, mobileSrc, mobileQuery, reducedMotion]);

  const controlLabel = playing ? "Pause background video" : "Resume background video";

  return (
    <>
      <video
        ref={ref}
        id={videoId}
        className={className}
        muted
        loop
        playsInline
        preload={reducedMotion ? "none" : preload}
        poster={poster}
        aria-label={ariaLabel}
        data-background-video="true"
        data-motion={reducedMotion ? "reduced" : "allowed"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEmptied={() => setPlaying(false)}
        onError={() => setPlaying(false)}
      />
      {!reducedMotion ? (
        <button
          type="button"
          className={styles.control}
          aria-label={controlLabel}
          aria-controls={videoId}
          title={controlLabel}
          onClick={() => {
            if (!ref.current) return;
            userPaused.current = !ref.current.paused;
            syncPlayback.current?.();
          }}
        >
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
      ) : null}
    </>
  );
}
