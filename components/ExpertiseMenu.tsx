"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const expertiseLinks = [
  { label: "JZ Demolition", href: "/demolition" },
  { label: "JZ Construction", href: "/construction" },
  { label: "JZ Waste Management", href: "/waste-management" },
  { label: "JZ Development", href: "/development" },
] as const;

export function ExpertiseMenu() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="expertise-menu"
      data-open={open ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      ref={root}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className="expertise-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Companies <ChevronDown aria-hidden="true" size={14} />
      </button>
      <div className="expertise-menu-panel" aria-hidden={!open}>
        {expertiseLinks.map((item, index) => (
          <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
