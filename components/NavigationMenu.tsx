"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type NavigationMenuItem = {
  label: string;
  href: string;
  index: string;
};

type NavigationMenuProps = {
  label: string;
  items: readonly NavigationMenuItem[];
  className?: string;
};

export function NavigationMenu({ label, items, className = "" }: NavigationMenuProps) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const current = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 240);
  };

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
      if (closeTimer.current) clearTimeout(closeTimer.current);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`navigation-menu ${className}`.trim()}
      data-current={current ? "true" : "false"}
      data-open={open ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          cancelClose();
          setOpen(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleClose();
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
        className="navigation-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {label} <ChevronDown aria-hidden="true" size={14} />
      </button>
      <div className="navigation-menu-panel" aria-hidden={!open} inert={!open ? true : undefined}>
        <div className="navigation-menu-grid">
          {items.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              <span>{item.index}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
