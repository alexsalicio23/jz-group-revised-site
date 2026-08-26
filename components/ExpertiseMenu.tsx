import { NavigationMenu } from "@/components/NavigationMenu";

const expertiseLinks = [
  { index: "01", label: "JZ Demolition", href: "/demolition" },
  { index: "02", label: "JZ Construction", href: "/construction" },
  { index: "03", label: "JZ Waste Management", href: "/waste-management" },
  { index: "04", label: "JZ Development", href: "/development" },
] as const;

export function ExpertiseMenu() {
  return <NavigationMenu className="expertise-menu" items={expertiseLinks} label="Companies" />;
}
