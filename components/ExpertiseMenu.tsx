import { NavigationMenu } from "@/components/NavigationMenu";

const expertiseLinks = [
  { index: "01", label: "JZ Demolition", href: "/demolition", description: "Specialty, selective, total, robotic and concrete demolition" },
  { index: "02", label: "JZ Construction", href: "/construction", description: "General contracting, preconstruction and interior trades" },
  { index: "03", label: "JZ Waste Management", href: "/waste-management", description: "Dumpsters, hauling, cleanup and site logistics" },
  { index: "04", label: "JZ Development", href: "/development", description: "Acquisition, planning, delivery and long-term operations" },
] as const;

export function ExpertiseMenu() {
  return <NavigationMenu className="expertise-menu" items={expertiseLinks} label="Companies" />;
}
