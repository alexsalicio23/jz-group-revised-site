import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const routes = [
  { index: "01", label: "Services", detail: "Find the right capability", href: "/services" },
  { index: "02", label: "Projects", detail: "Review comparable work", href: "/projects" },
  { index: "03", label: "Qualifications", detail: "Review operating standards", href: "/safety" },
  { index: "04", label: "Contact", detail: "Send a scope to JZ", href: "/contact" },
] as const;

export function QuickAccess() {
  return (
    <nav className="group-quick-access" aria-label="Quick access">
      {routes.map((route) => (
        <Link href={route.href} key={route.href}>
          <span>{route.index}</span>
          <div><strong>{route.label}</strong><small>{route.detail}</small></div>
          <ArrowUpRight aria-hidden="true" size={19} />
        </Link>
      ))}
    </nav>
  );
}
