"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Background video that downloads exactly one encode.
 *
 * The `media` attribute on <source> is only honoured inside <picture>. Inside
 * <video>, Chromium and WebKit walk the source list, fetch what they touch, and
 * settle on the last entry — so a "mobile source + desktop source" pair means
 * every visitor downloads both files and then plays the desktop one. Choosing
 * the src at runtime is the only reliable way to ship a single file.
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

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.src) return;
    el.src = mobileSrc && window.matchMedia(mobileQuery).matches ? mobileSrc : src;
  }, [src, mobileSrc, mobileQuery]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      poster={poster}
      aria-label={ariaLabel}
    />
  );
}
