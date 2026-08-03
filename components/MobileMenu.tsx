"use client";

import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "#expertise", label: "Expertise" },
  { href: "#group", label: "The group" },
  { href: "#projects", label: "Proof" },
  { href: "#qualifications", label: "Safety" },
  { href: "#contact", label: "Contact estimating" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.setAttribute("data-ready", "true");
  }, []);

  return (
    <div className={`mobile-menu${isOpen ? " is-open" : ""}`} ref={menuRef}>
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        className="mobile-menu-toggle"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        Menu
      </button>
      <nav aria-label="Mobile navigation" hidden={!isOpen} id="mobile-navigation">
        {navigation.map((item) => (
          <a href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
