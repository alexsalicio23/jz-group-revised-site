"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

export type RevealTone = "demolition" | "waste-management" | "construction" | "development" | "neutral";

const revealColors: Record<RevealTone, string> = {
  demolition: "#485c68",
  "waste-management": "#526257",
  construction: "#85898a",
  development: "#665e59",
  neutral: "#0b0d0e",
};

type RevealOptions = {
  source: HTMLElement;
  tone?: RevealTone;
  compact?: boolean;
  onCovered: () => void;
  onComplete?: () => void;
};

type MotionContextValue = {
  runReveal: (options: RevealOptions) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedMotionRef.current = query.matches; };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => () => {
    timelineRef.current?.kill();
  }, []);

  const runReveal = useCallback((options: RevealOptions) => {
    const overlay = overlayRef.current;
    const circle = circleRef.current;

    if (!overlay || !circle || reducedMotionRef.current) {
      options.onCovered();
      options.onComplete?.();
      return;
    }

    timelineRef.current?.kill();

    const bounds = options.source.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const farthestX = Math.max(x, window.innerWidth - x);
    const farthestY = Math.max(y, window.innerHeight - y);
    const scale = Math.hypot(farthestX, farthestY) / 34 + 1;
    const expandDuration = options.compact ? 0.42 : 0.58;

    gsap.set(overlay, { display: "block", opacity: 1, pointerEvents: "auto" });
    gsap.set(circle, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
      scale: 0.82,
      backgroundColor: revealColors[options.tone ?? "neutral"],
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none", opacity: 0, pointerEvents: "none" });
        options.onComplete?.();
      },
    });

    timeline
      .to(circle, { scale, duration: expandDuration, ease: "power4.inOut" })
      .call(options.onCovered, [], expandDuration * 0.72)
      .to(overlay, { opacity: 0, duration: options.compact ? 0.16 : 0.22, ease: "power2.out" }, expandDuration * 0.84);

    timelineRef.current = timeline;
  }, []);

  return (
    <MotionContext.Provider value={{ runReveal }}>
      {children}
      <div className="motion-page-reveal" ref={overlayRef} aria-hidden="true">
        <span ref={circleRef} />
      </div>
    </MotionContext.Provider>
  );
}

export function useMotionReveal() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotionReveal must be used inside MotionProvider");
  return context;
}

export function ActionCircle({ className = "" }: { className?: string }) {
  return (
    <span className={`motion-action-circle ${className}`.trim()} aria-hidden="true">
      <ArrowUpRight size={19} strokeWidth={1.7} />
    </span>
  );
}

export function CircleTransitionLink({
  href,
  tone = "neutral",
  compact = true,
  className = "",
  children,
  ariaLabel,
}: {
  href: string;
  tone?: RevealTone;
  compact?: boolean;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const { runReveal } = useMotionReveal();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      href.includes("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    event.preventDefault();
    const source = event.currentTarget.querySelector<HTMLElement>(".motion-action-circle") ?? event.currentTarget;
    runReveal({ source, tone, compact, onCovered: () => router.push(href) });
  };

  return (
    <Link className={className} href={href} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function MediaTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointer.matches || reduced.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      frame = 0;
      root.style.setProperty("--tilt-x", `${(-y * 3.4).toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${(x * 4.2).toFixed(2)}deg`);
      root.style.setProperty("--tilt-shift-x", `${(x * 7).toFixed(2)}px`);
      root.style.setProperty("--tilt-shift-y", `${(y * 6).toFixed(2)}px`);
      root.style.setProperty("--tilt-highlight-x", `${((x + 1) * 50).toFixed(1)}%`);
      root.style.setProperty("--tilt-highlight-y", `${((y + 1) * 50).toFixed(1)}%`);
    };

    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      root.dataset.tilting = "true";
      if (!frame) frame = requestAnimationFrame(render);
    };

    const leave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      root.dataset.tilting = "false";
      root.style.setProperty("--tilt-x", "0deg");
      root.style.setProperty("--tilt-y", "0deg");
      root.style.setProperty("--tilt-shift-x", "0px");
      root.style.setProperty("--tilt-shift-y", "0px");
    };

    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div className={`media-tilt ${className}`.trim()} ref={rootRef}>{children}</div>;
}
