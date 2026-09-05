import type { TemplateSlug } from "@/app/templates/template-data";

export const contactDivisions = ["demolition", "construction", "waste-management", "development"] as const;

export const rentalContainerOptions = [
  { value: "15-trailer", label: "15-yard dump trailer" },
  { value: "15-rolloff", label: "15-yard roll-off container" },
  { value: "20-rolloff", label: "20-yard roll-off container" },
  { value: "30-rolloff", label: "30-yard roll-off container" },
] as const;

export type RentalContainerToken = typeof rentalContainerOptions[number]["value"];
export type ContactIntent = {
  division: TemplateSlug;
  inquiry?: "rental";
  container?: RentalContainerToken;
};

export function isContactDivision(value: string | null | undefined): value is TemplateSlug {
  return contactDivisions.some((division) => division === value);
}

export function isRentalContainerToken(value: string | null | undefined): value is RentalContainerToken {
  return rentalContainerOptions.some((container) => container.value === value);
}

export function parseContactIntent(search: string | URLSearchParams, defaultDivision: string = "demolition"): ContactIntent {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const requestedDivision = [params.get("for"), params.get("company")].find(isContactDivision);
  const division = requestedDivision ?? (isContactDivision(defaultDivision) ? defaultDivision : "demolition");
  const inquiry = division === "waste-management" && params.get("inquiry") === "rental" ? "rental" : undefined;
  const requestedContainer = params.get("container");
  return {
    division,
    ...(inquiry ? { inquiry } : {}),
    ...(inquiry && isRentalContainerToken(requestedContainer) ? { container: requestedContainer } : {}),
  };
}

export function buildContactIntentHref(intent: ContactIntent) {
  const params = new URLSearchParams();
  if (isContactDivision(intent.division)) params.set("for", intent.division);
  if (intent.division === "waste-management" && intent.inquiry === "rental") {
    params.set("inquiry", "rental");
    if (isRentalContainerToken(intent.container)) params.set("container", intent.container);
  }
  return `/contact${params.size ? `?${params.toString()}` : ""}`;
}
