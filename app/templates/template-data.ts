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
  email: string;
  hero: {
    type: "video" | "triptych";
    media?: string;
    poster?: string;
    mobileMedia?: string;
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
    index: "01",
    name: "JZ Demolition",
    shortName: "Demolition",
    legalName: "A JZ Group company",
    discipline: "Selective / Structural / Concrete",
    headline: "Specialty demolition where the building cannot stop.",
    introduction:
      "Built for active hospitals, occupied facilities, and complex commercial scopes where precision, safety, and continuity matter as much as removal.",
    email: "estimating@jzdemo.com",
    hero: {
      type: "video",
      media: "/media/video/hero-demolition.mp4",
      mobileMedia: "/media/video/hero-demolition-mobile.mp4",
      poster: "/media/video/hero-demolition-poster.jpg",
    },
    proof: [
      { label: "Featured scope", value: "16,300 SF" },
      { label: "Operating condition", value: "Active hospital" },
      { label: "Execution window", value: "Overnight" },
    ],
    servicesLead:
      "JZ Demolition removes exactly what the next phase requires while protecting what stays in service around it.",
    services: [
      { name: "Selective interior demolition", detail: "Precise removal planned around retained systems and occupied areas.", href: "/demolition/services/interior-demolition" },
      { name: "Structural demolition", detail: "Full structural takedowns with deliberate sequencing and field control.", href: "/demolition/services/total-demolition" },
      { name: "Concrete demolition", detail: "Scanning, cutting, and removal coordinated within the demolition scope.", href: "/demolition/services/concrete-work" },
      { name: "Active-facility work", detail: "Healthcare and commercial work planned around continuing operations.", href: "/demolition/projects/healthcare" },
      { name: "Waste hauling", detail: "Material movement coordinated with the pace and access constraints of the site.", href: "/demolition/services/waste-hauling" },
      { name: "Final turnover", detail: "A cleared work area left ready for the trade that follows.", href: "/demolition/projects" },
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
      { number: "03", title: "Remove", description: "Execute with experienced crews, clear supervision, and the right equipment." },
      { number: "04", title: "Turn over", description: "Clear the area and leave the next trade with a work-ready site." },
    ],
    close: "Send the plans. We will define the demolition approach.",
  },
  "waste-management": {
    slug: "waste-management",
    index: "02",
    name: "JZ Waste Management",
    shortName: "Waste Management",
    legalName: "A JZ Group company",
    discipline: "Dumpsters / Hauling / Site support",
    headline: "Keep the site moving.",
    introduction:
      "Dumpsters, debris hauling, temporary fencing, and cleanup support for contractors who need material to keep moving without slowing the work.",
    email: "estimating@jzwastemanagement.com",
    hero: {
      type: "video",
      media: "/media/video/workflow-waste.mp4",
      poster: "/media/video/workflow-waste-poster.jpg",
    },
    proof: [
      { label: "Service", value: "Deliver" },
      { label: "Response", value: "Swap" },
      { label: "Closeout", value: "Haul" },
    ],
    servicesLead:
      "One accountable service lane for the equipment, labor, and hauling that keep a commercial site clear and productive.",
    services: [
      { name: "Dumpster rentals", detail: "Containers coordinated to the scale, access, and timing of the project.", href: "/waste-management/services/dumpster-rentals" },
      { name: "Debris hauling", detail: "Scheduled material removal that follows the actual pace of field production.", href: "/waste-management/services/dumpster-rentals" },
      { name: "Temporary fencing", detail: "Perimeter support for active construction and demolition environments.", href: "/waste-management/services/temporary-fencing" },
      { name: "Site cleanup labor", detail: "Crews available to maintain clean, workable conditions across the site.", href: "/waste-management/services/general-labor" },
      { name: "Construction cleanup", detail: "Ongoing and final cleanup support for contractor-led projects.", href: "/waste-management/services/general-labor" },
      { name: "Residential cleanouts", detail: "Direct removal and hauling for full-property cleanout scopes.", href: "/waste-management/services/dumpster-rentals" },
    ],
    feature: {
      eyebrow: "Contractor support",
      title: "The site stays productive when material keeps moving.",
      description:
        "JZ Waste Management coordinates containers, hauling, fencing, and labor around the contractor's schedule rather than treating each request as an isolated delivery.",
      media: "/media/field-story/waste-truck.webp",
      mediaType: "image",
      facts: [
        { label: "Coverage", value: "South Florida" },
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
    close: "Tell us the site, the material, and the schedule.",
  },
  construction: {
    slug: "construction",
    index: "03",
    name: "JZ Construction",
    shortName: "Construction",
    legalName: "A JZ Group company",
    discipline: "Commercial / Interiors / Field execution",
    headline: "Field execution, made visible.",
    introduction:
      "Field-ready construction for framing, drywall, finishes, concrete support, remodeling, and site preparation across South Florida.",
    email: "estimating@jzconstruction.com",
    hero: {
      type: "video",
      media: "/media/video/workflow-build.mp4",
      poster: "/media/video/workflow-build-poster.jpg",
    },
    proof: [
      { label: "Field start", value: "Site preparation" },
      { label: "Build", value: "Framing + drywall" },
      { label: "Handover", value: "Finished space" },
    ],
    servicesLead:
      "JZ Construction brings field execution and accountable supervision to commercial interiors, renovations, and supporting concrete scopes.",
    services: [
      { name: "Commercial construction", detail: "Coordinated field delivery for new and renovated commercial environments.", href: "/construction/services/general-contracting" },
      { name: "Remodeling", detail: "Interior renovation work sequenced around the existing building and project team.", href: "/construction/services/general-contracting" },
      { name: "Site preparation", detail: "Early field work that gives the construction phase a clean, organized start.", href: "/construction/services/general-contracting" },
      { name: "Framing", detail: "Metal framing installed to plans with close coordination across adjacent trades.", href: "/construction/services/subcontracting" },
      { name: "Drywall and finishing", detail: "Board, finish, and closeout work delivered as a complete interior scope.", href: "/construction/services/subcontracting" },
      { name: "Concrete work", detail: "Concrete support coordinated with the demands of the wider project.", href: "/construction/services/subcontracting" },
    ],
    feature: {
      eyebrow: "Field execution",
      title: "Built by people who understand the full site.",
      description:
        "The construction team works within the same operating system as JZ's demolition and waste companies, giving overlapping scopes a clearer handoff and a single standard of accountability.",
      media: "/media/field-story/field-control.webp",
      mediaType: "image",
      facts: [
        { label: "Capability", value: "Commercial interiors" },
        { label: "Delivery", value: "Field-led" },
        { label: "Region", value: "South Florida" },
      ],
    },
    process: [
      { number: "01", title: "Scope", description: "Confirm the plans, field conditions, interfaces, and responsible parties." },
      { number: "02", title: "Schedule", description: "Sequence labor and material around the project team's milestones." },
      { number: "03", title: "Build", description: "Execute with experienced supervision and visible field coordination." },
      { number: "04", title: "Handover", description: "Close the details and turn over a clean, finished environment." },
    ],
    close: "Bring us the scope. We will bring the field plan.",
  },
  development: {
    slug: "development",
    index: "04",
    name: "JZ Development",
    shortName: "Development",
    legalName: "A JZ Group company",
    discipline: "Acquire / Plan / Build / Manage",
    headline: "Think beyond completion.",
    introduction:
      "Land acquisition, project planning, construction oversight, and property management under one accountable team.",
    email: "estimating@jzdevelopment.com",
    hero: {
      type: "triptych",
      triptych: [
        { media: "/media/video/development-exterior.mp4", poster: "/media/video/development-exterior-poster.jpg" },
        { media: "/media/video/development-kitchen.mp4", poster: "/media/video/development-kitchen-poster.jpg" },
        { media: "/media/video/development-interior.mp4", poster: "/media/video/development-interior-poster.jpg" },
      ],
    },
    proof: [
      { label: "Start", value: "Land acquisition" },
      { label: "Delivery", value: "Project oversight" },
      { label: "Long term", value: "Property management" },
    ],
    servicesLead:
      "JZ Development connects opportunity, delivery, and long-term ownership through one clear development lifecycle.",
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
        "A development direction built around acquisition, execution, and operation. Final client-review photography will replace social-source footage once the project library is approved.",
      media: "/media/video/development-kitchen.mp4",
      mediaType: "video",
      poster: "/media/video/development-kitchen-poster.jpg",
      facts: [
        { label: "Asset type", value: "Workforce housing" },
        { label: "Model", value: "Full lifecycle" },
        { label: "Status", value: "Public draft story" },
      ],
    },
    process: [
      { number: "01", title: "Acquire", description: "Find the opportunity and establish a grounded investment thesis." },
      { number: "02", title: "Plan", description: "Define the program, partners, approvals, schedule, and delivery model." },
      { number: "03", title: "Build", description: "Oversee execution with owner-level visibility from start to completion." },
      { number: "04", title: "Manage", description: "Operate the finished asset with long-term performance in view." },
    ],
    close: "Start with the opportunity. Build toward the long term.",
  },
};

export function isTemplateSlug(value: string): value is TemplateSlug {
  return templateOrder.includes(value as TemplateSlug);
}
