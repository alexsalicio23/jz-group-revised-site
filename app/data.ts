export const contact = {
  phoneDisplay: "(305) 793-2984",
  phoneHref: "tel:+13057932984",
  email: "estimating@jzdemo.com",
  address: "15219 NW 60th Ave, Miami Lakes, Florida 33014",
};

export const divisions = [
  {
    number: "01",
    slug: "demolition",
    name: "JZ Demolition",
    short: "Demolition",
    kicker: "Define the cut.",
    description:
      "Selective interior, structural, and concrete demolition planned around active and occupied environments.",
    media: "/media/field-story/demolition-floor.webp",
    type: "image" as const,
  },
  {
    number: "02",
    slug: "construction",
    name: "JZ Construction",
    short: "Construction",
    kicker: "Move the site forward.",
    description:
      "Framing, drywall, finishing, concrete support, and commercial construction delivered by the same group.",
    media: "/media/video/workflow-build.mp4",
    poster: "/media/field-story/hero-field.webp",
    type: "video" as const,
  },
  {
    number: "03",
    slug: "waste-management",
    name: "JZ Waste Management",
    short: "Waste",
    kicker: "Keep material moving.",
    description:
      "Dumpsters, hauling, temporary fencing, and site cleanup coordinated around the pace of the work.",
    media: "/media/video/workflow-waste.mp4",
    poster: "/media/field-story/waste-truck.webp",
    type: "video" as const,
  },
  {
    number: "04",
    slug: "development",
    name: "JZ Development",
    short: "Development",
    kicker: "Extend the lifecycle.",
    description:
      "Development capability spanning acquisition, planning, construction oversight, and property management.",
    media: "/media/field-story/one-group.webp",
    type: "image" as const,
  },
];

export const clientLogos = [
  { name: "Green Label Construction", src: "/media/client-green-label.png" },
  { name: "R & Associates", src: "/media/client-r-associates.png" },
  { name: "White Oak", src: "/media/client-white-oak.png" },
  { name: "Building OHLA", src: "/media/client-building-ohla.png" },
  { name: "Thornton Construction", src: "/media/client-thornton.png" },
  { name: "Lee Construction", src: "/media/client-lee.png" },
  { name: "John Bell Construction", src: "/media/client-john-bell.png" },
  { name: "Vilar Hoynack", src: "/media/client-vilar-hoynack.png" },
  { name: "Nicklaus Children's", src: "/media/client-nicklaus.png" },
  { name: "Turner Construction", src: "/media/client-turner.png" },
  { name: "UHealth", src: "/media/client-uhealth.png" },
];

export const activeProcess = [
  {
    number: "01",
    title: "Plan",
    description: "Walk the site, document conditions, and define what comes out and what stays.",
    href: "/demolition#process",
  },
  {
    number: "02",
    title: "Protect",
    description: "Sequence the work around the facility, its people, and the operations that continue around us.",
    href: "/demolition#process",
  },
  {
    number: "03",
    title: "Execute",
    description: "Put experienced crews, clear supervision, and the right equipment behind the scope.",
    href: "/demolition#process",
  },
  {
    number: "04",
    title: "Turn over",
    description: "Clear the area and leave the next trade with a site that is ready for work.",
    href: "/demolition#process",
  },
];

export const featuredProjects = [
  {
    index: "01",
    title: "Baptist Medical Arts Building",
    market: "Active healthcare",
    location: "South Florida",
    scope: "Fourth-floor selective interior demolition",
    summary:
      "A complex demolition scope planned around an active hospital environment and an overnight execution window.",
    facts: [
      ["Scope", "16,300 SF"],
      ["Condition", "Active hospital"],
      ["Execution", "Overnight"],
    ],
    mediaLabel: "ACTIVE HOSPITAL PROJECT PHOTO",
  },
  {
    index: "02",
    title: "Broward Medical Office Building",
    market: "Medical office",
    location: "Pompano Beach, Florida",
    scope: "Multi-floor demolition and concrete work",
    summary:
      "Three stories of interior demolition with concrete scanning and cutting coordinated within the same scope.",
    facts: [
      ["Building", "3 stories"],
      ["Scope", "Interior demolition"],
      ["Concrete", "Scanning + cutting"],
    ],
    mediaLabel: "MEDICAL OFFICE PROJECT PHOTO",
  },
  {
    index: "03",
    title: "Workforce Housing Development",
    market: "Development",
    location: "Florida",
    scope: "Planning through construction oversight",
    summary:
      "A completed development representing JZ's long-term view of planning, execution, and lasting community value.",
    facts: [
      ["Division", "JZ Development"],
      ["Asset", "Workforce housing"],
      ["Status", "Completed"],
    ],
    mediaLabel: "COMPLETED DEVELOPMENT PHOTO",
  },
] as const;

export const qualificationRecords = [
  {
    title: "Active-facility experience",
    description: "Work planned around facilities, people, and systems that remain operational beside the scope.",
  },
  {
    title: "Site-specific planning",
    description: "Access, work zones, material movement, sequencing, and turnover are defined around each site.",
  },
  {
    title: "Experienced field supervision",
    description: "Clear field leadership keeps the work controlled, documented, and coordinated with the next trade.",
  },
  {
    title: "Clean turnover",
    description: "The work area is cleared and prepared for the next phase instead of becoming someone else's problem.",
  },
] as const;
