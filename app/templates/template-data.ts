export type TemplateSlug =
  | "demolition"
  | "waste-management"
  | "construction"
  | "development";

export type DivisionTemplateData = {
  slug: TemplateSlug;
  index: string;
  name: string;
  shortName: string;
  legalName: string;
  discipline: string;
  headline: string;
  introduction: string;
  /** Search-result title. Falls back to "<name> | JZ Group" when absent. */
  seoTitle?: string;
  /** Search-result description. Falls back to `introduction` when absent. */
  seoDescription?: string;
  email: string;
  hero: {
    type: "video" | "triptych" | "image";
    media?: string;
    poster?: string;
    mobileMedia?: string;
    alt?: string;
    triptych?: Array<{ media: string; poster: string }>;
  };
  proof: Array<{ label: string; value: string }>;
  servicesLead: string;
  services: Array<{ name: string; detail: string; href?: string }>;
  feature: {
    eyebrow: string;
    title: string;
    description: string;
    media: string;
    mediaType: "image" | "video";
    poster?: string;
    facts: Array<{ label: string; value: string }>;
  };
  process: Array<{ number: string; title: string; description: string }>;
  close: string;
  ctaLabel?: string;
};

export const templateOrder: TemplateSlug[] = [
  "demolition",
  "construction",
  "waste-management",
  "development",
];

export const templates: Record<TemplateSlug, DivisionTemplateData> = {
  demolition: {
    slug: "demolition",
    seoTitle: "Commercial Demolition Contractor in Miami | JZ",
    seoDescription:
      "Full-service demolition including specialty, selective, total, structural, robotic and concrete demolition across Florida.",
    index: "01",
    name: "JZ Demolition",
    shortName: "Demolition",
    legalName: "A JZ Group company",
    discipline: "Specialty / Selective / Total / Concrete",
    headline: "Demolition for Every Scope",
    introduction:
      "Full-service demolition capability spanning specialty and selective interiors, total and structural removal, robotic demolition, concrete services, site preparation, and controlled material removal.",
    email: "estimating@jzdemo.com",
    hero: {
      type: "video",
      media: "/media/video/hero-demolition.mp4",
      mobileMedia: "/media/video/hero-demolition-mobile.mp4",
      poster: "/media/website-photos/demolition-active-interior.webp",
    },
    proof: [
      { label: "Capability", value: "Full service" },
      { label: "Specialty", value: "Active facilities" },
      { label: "Coverage", value: "Florida" },
    ],
    servicesLead: "Full-Service Demolition",
    services: [
      { name: "Specialty and selective demolition", detail: "Precise interior removal planned around retained systems, occupied areas, and complex operating conditions.", href: "/demolition/services/interior-demolition" },
      { name: "Total and structural demolition", detail: "Full-building and structural removal with deliberate sequencing, equipment planning, and field control.", href: "/demolition/services/total-demolition" },
      { name: "Site preparation", detail: "Clearing, early removal, and field preparation that give the next project phase a controlled start.", href: "/demolition/services/total-demolition" },
      { name: "Robotic demolition", detail: "Remote demolition capability for demanding access, concrete, and production conditions.", href: "/demolition/services/concrete-work" },
      { name: "Concrete services", detail: "Concrete scanning, cutting, breaking, and removal coordinated within the wider scope.", href: "/demolition/services/concrete-work" },
      { name: "Preconstruction and site logistics", detail: "Early scope review, sequencing, access, equipment, hauling, and turnover planning before field execution.", href: "/demolition#process" },
    ],
    feature: {
      eyebrow: "Comparable healthcare work",
      title: "Baptist Medical Arts Building",
      description:
        "Fourth-floor selective interior demolition completed overnight while hospital operations continued around the work.",
      media: "/media/field-story/demolition-floor.webp",
      mediaType: "image",
      facts: [
        { label: "Floor area", value: "16,300 SF" },
        { label: "Environment", value: "Active hospital" },
        { label: "Result", value: "Ready for next phase" },
      ],
    },
    process: [
      { number: "01", title: "Define", description: "Walk the site, document the conditions, and isolate the exact scope." },
      { number: "02", title: "Protect", description: "Plan around the people, systems, and operations that remain active." },
      { number: "03", title: "Plan", description: "Sequence labor, equipment, access, hauling, and protection around the project." },
      { number: "04", title: "Execute", description: "Perform the work with experienced crews, clear supervision, and the right equipment." },
      { number: "05", title: "Turn over", description: "Clear the area and leave the next trade with a work-ready site." },
    ],
    close: "Send us the demolition scope.",
    ctaLabel: "Send us the demolition scope",
  },
  "waste-management": {
    slug: "waste-management",
    seoTitle: "Dumpster Rental and Debris Hauling in Miami | JZ",
    seoDescription:
      "Roll-off dumpsters, debris hauling, temporary fencing, cleanup labor and site logistics for contractors across Florida.",
    index: "02",
    name: "JZ Waste Management",
    shortName: "Waste Management",
    legalName: "A JZ Group company",
    discipline: "Dumpsters / Hauling / Site support",
    headline: "Keep the site moving.",
    introduction:
      "Dumpsters, hauling, temporary fencing, cleanup labor, recycling, and site logistics coordinated around the pace of contractor-led work.",
    email: "estimating@jzwastemanagement.com",
    hero: {
      type: "video",
      media: "/media/video/workflow-waste.mp4",
      poster: "/media/video/workflow-waste-poster.jpg",
    },
    proof: [
      { label: "Coverage", value: "Statewide" },
      { label: "Service", value: "Contractor led" },
      { label: "Support", value: "Site logistics" },
    ],
    servicesLead: "Complete Site Support",
    services: [
      { name: "Dumpster rentals", detail: "Containers coordinated to the scale, access, and timing of the project.", href: "/waste-management/services/dumpster-rentals" },
      { name: "Debris hauling", detail: "Scheduled material removal that follows the actual pace of field production.", href: "/waste-management/services/dumpster-rentals" },
      { name: "Temporary fencing", detail: "Perimeter support for active construction and demolition environments.", href: "/waste-management/services/temporary-fencing" },
      { name: "Site cleanup labor", detail: "Crews available to maintain clean, workable conditions across the site.", href: "/waste-management/services/general-labor" },
      { name: "Construction cleanup", detail: "Ongoing and final cleanup support for contractor-led projects.", href: "/waste-management/services/general-labor" },
      { name: "Recycling coordination", detail: "Material streams coordinated with project requirements and available receiving facilities.", href: "/waste-management/services/dumpster-rentals" },
    ],
    feature: {
      eyebrow: "Contractor support",
      title: "Site Logistics",
      description:
        "JZ Waste Management coordinates containers, hauling, fencing, and labor around the contractor's schedule rather than treating each request as an isolated delivery.",
      media: "/media/field-story/waste-truck.webp",
      mediaType: "image",
      facts: [
        { label: "Coverage", value: "Statewide Florida" },
        { label: "Support", value: "Commercial sites" },
        { label: "Program", value: "Ongoing GC service" },
      ],
    },
    process: [
      { number: "01", title: "Size", description: "Match the container and support plan to the project and access conditions." },
      { number: "02", title: "Deliver", description: "Coordinate placement with the superintendent and active site logistics." },
      { number: "03", title: "Move", description: "Swap and haul around production so debris does not become a bottleneck." },
      { number: "04", title: "Leave clean", description: "Support ongoing cleanup and a deliberate final closeout." },
    ],
    close: "Plan Site Service",
    ctaLabel: "Plan site service",
  },
  construction: {
    slug: "construction",
    seoTitle: "Commercial General Contractor in Miami | JZ",
    seoDescription:
      "General contracting, preconstruction, project management and subcontracting for commercial, residential, healthcare and renovation projects across Florida.",
    index: "03",
    name: "JZ Construction",
    shortName: "Construction",
    legalName: "A JZ Group company",
    discipline: "General Contracting / Subcontracting / Preconstruction",
    headline: "General Contracting",
    introduction:
      "General contracting, subcontracting, preconstruction, and field execution for commercial, multifamily, healthcare, education, and renovation projects across Florida.",
    email: "estimating@jzconstruction.com",
    hero: {
      type: "video",
      media: "/media/video/workflow-build.mp4",
      poster: "/media/website-photos/construction-framed-interior.webp",
    },
    proof: [
      { label: "Delivery lane", value: "General contracting" },
      { label: "Trade lane", value: "Subcontracting" },
      { label: "Coverage", value: "Florida" },
    ],
    servicesLead: "Two Ways to Build",
    services: [
      { name: "General contracting", detail: "Project leadership from preconstruction through closeout for new construction, renovations, and commercial delivery.", href: "/construction/services/general-contracting" },
      { name: "Preconstruction", detail: "Scope development, logistics, scheduling, procurement planning, and early coordination before mobilization.", href: "/construction/services/general-contracting" },
      { name: "Project management and supervision", detail: "Visible leadership across schedule, trade coordination, field production, documentation, and closeout.", href: "/construction/services/general-contracting" },
      { name: "Framing and drywall", detail: "Metal framing, board, finishing, and interior assemblies installed as a coordinated trade scope.", href: "/construction/services/subcontracting" },
      { name: "Ceilings and Division 10", detail: "Ceiling systems, wall protection, specialties, and supporting interior scopes delivered for the project team.", href: "/construction/services/subcontracting" },
      { name: "Concrete and supporting trades", detail: "Concrete support and complementary field scopes coordinated with the wider construction schedule.", href: "/construction/services/subcontracting" },
    ],
    feature: {
      eyebrow: "Field execution",
      title: "Field Experience",
      description:
        "The construction team works within the same operating system as JZ's demolition and waste companies, giving overlapping scopes a clearer handoff and a single standard of accountability.",
      media: "/media/website-photos/construction-project-coordination.webp",
      mediaType: "image",
      facts: [
        { label: "Lead project", value: "100 Biscayne" },
        { label: "Delivery", value: "GC + subcontracting" },
        { label: "Region", value: "Florida" },
      ],
    },
    process: [
      { number: "01", title: "Scope", description: "Confirm the plans, field conditions, interfaces, and responsible parties." },
      { number: "02", title: "Schedule", description: "Sequence labor and material around the project team's milestones." },
      { number: "03", title: "Build", description: "Execute with experienced supervision and visible field coordination." },
      { number: "04", title: "Handover", description: "Close the details and turn over a clean, finished environment." },
    ],
    close: "Start Construction",
    ctaLabel: "Send the construction scope",
  },
  development: {
    slug: "development",
    seoTitle: "South Florida Real Estate Development | JZ",
    seoDescription:
      "Acquisition, planning, construction oversight, property operations and long-term ownership strategy for Florida development opportunities.",
    index: "04",
    name: "JZ Development",
    shortName: "Development",
    legalName: "A JZ Group company",
    discipline: "Acquire / Plan / Build / Manage",
    headline: "Long-Term Development",
    introduction:
      "Development capability spanning acquisition, planning, construction oversight, property operations, and long-term ownership.",
    email: "estimating@jzdevelopment.com",
    hero: {
      type: "image",
      media: "/media/development/workforce-housing-kitchen.webp",
      alt: "Completed workforce housing unit interior delivered by JZ Development",
    },
    proof: [
      { label: "Opportunity", value: "Acquisition" },
      { label: "Delivery", value: "Oversight" },
      { label: "Long term", value: "Operations" },
    ],
    servicesLead: "The Development Lifecycle",
    services: [
      { name: "Land acquisition", detail: "Identify and evaluate opportunities that align with the development strategy.", href: "/development/about" },
      { name: "Project planning", detail: "Shape the program, team, schedule, and delivery path before work begins.", href: "/development/about" },
      { name: "Construction oversight", detail: "Maintain owner-side visibility as the project moves from plan to field.", href: "/development/about" },
      { name: "Property management", detail: "Carry accountability beyond completion into the operation of the asset.", href: "/development/about" },
      { name: "Workforce housing", detail: "Development focused on practical housing needs and long-term community value.", href: "/development/projects" },
      { name: "Redevelopment", detail: "Reposition existing property through a coordinated plan and delivery strategy.", href: "/development/projects" },
    ],
    feature: {
      eyebrow: "Current public project story",
      title: "Workforce housing development",
      description:
        "A development approach connecting acquisition, project planning, construction oversight, and property management around workforce housing and long-term community value.",
      media: "/media/video/development-kitchen.mp4",
      mediaType: "video",
      poster: "/media/video/development-kitchen-poster.jpg",
      facts: [
        { label: "Asset type", value: "Workforce housing" },
        { label: "Model", value: "Full lifecycle" },
        { label: "Portfolio", value: "JZ to confirm" },
      ],
    },
    process: [
      { number: "01", title: "Acquire", description: "Find the opportunity and establish a grounded investment thesis." },
      { number: "02", title: "Plan", description: "Define the program, partners, approvals, schedule, and delivery model." },
      { number: "03", title: "Build", description: "Oversee execution with owner-level visibility from start to completion." },
      { number: "04", title: "Manage", description: "Operate the finished asset with long-term performance in view." },
    ],
    close: "Discuss an Opportunity",
    ctaLabel: "Discuss an opportunity",
  },
};

export function isTemplateSlug(value: string): value is TemplateSlug {
  return templateOrder.includes(value as TemplateSlug);
}
