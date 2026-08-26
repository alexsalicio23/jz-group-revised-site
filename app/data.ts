export const contact = {
  phoneDisplay: "(305) 793-2984",
  phoneHref: "tel:+13057932984",
  email: "estimating@jzdemo.com",
  address: "14605 Harris Pl, Miami Lakes, FL 33014",
  streetAddress: "14605 Harris Pl",
  addressLocality: "Miami Lakes",
  addressRegion: "FL",
  postalCode: "33014",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=14605+Harris+Pl+Miami+Lakes+FL+33014",
  officeLabel: "JZ Group office",
};

export const divisions = [
  {
    number: "01",
    slug: "demolition",
    name: "JZ Demolition",
    short: "Demolition",
    kicker: "Control the scope.",
    description:
      "Specialty, selective, total, robotic, and concrete demolition delivered with precise planning and field control.",
    media: "/media/jzg/mob-pompano-demolition.webp",
    type: "image" as const,
  },
  {
    number: "02",
    slug: "construction",
    name: "JZ Construction",
    short: "Construction",
    kicker: "Lead the build.",
    description:
      "General contracting, subcontracting, preconstruction, and field execution for commercial and residential projects.",
    media: "/media/jzg/division-construction.webp",
    type: "image" as const,
  },
  {
    number: "03",
    slug: "waste-management",
    name: "JZ Waste Management",
    short: "Waste Management",
    kicker: "Keep the site moving.",
    description:
      "Dumpsters, hauling, temporary fencing, cleanup labor, and site logistics coordinated around the pace of the project.",
    media: "/media/jzg/division-waste.webp",
    type: "image" as const,
  },
  {
    number: "04",
    slug: "development",
    name: "JZ Development",
    short: "Development",
    kicker: "Extend the lifecycle.",
    description:
      "Development capability spanning acquisition, planning, construction oversight, property operations, and long-term value.",
    media: "/media/development/workforce-housing-kitchen.webp",
    type: "image" as const,
  },
];

export const publicPortfolioStats = [
  { value: "Healthcare", label: "Active and occupied facilities", href: "/demolition/projects/healthcare" },
  { value: "Education", label: "Campus renovation experience", href: "/demolition/projects/education" },
  { value: "Commercial", label: "Business and community environments", href: "/demolition/projects/business-community" },
  { value: "Retail", label: "Retail and entertainment environments", href: "/demolition/projects/retail-entertainment" },
] as const;

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
    title: "100 Biscayne",
    market: "JZ Construction",
    location: "Miami, Florida",
    scope: "Commercial construction field record",
    summary:
      "Field photography documenting plan review, interior framing, and project coordination during commercial construction.",
    facts: [
      ["Company", "JZ Construction"],
      ["Work shown", "Planning + framing"],
      ["Record", "Field photography"],
    ],
    images: [
      {
        src: "/media/jzg/project-100-biscayne.webp",
        alt: "A JZ team member reviewing drawings at 100 Biscayne",
        position: "center 48%",
      },
      {
        src: "/media/jzg/division-construction.webp",
        alt: "Interior framing at the 100 Biscayne project",
        position: "center",
      },
      {
        src: "/media/jzg/project-100-biscayne-team.webp",
        alt: "JZ field coordination at the 100 Biscayne project",
        position: "center",
      },
    ],
    href: "/construction/projects",
  },
  {
    index: "02",
    title: "MOB Pompano",
    market: "JZ Demolition",
    location: "Pompano Beach, Florida",
    scope: "Medical-office demolition and framing field record",
    summary:
      "A field-photography record showing demolition, containment, air-control equipment, and framing work inside a medical-office environment.",
    facts: [
      ["Company", "JZ Demolition"],
      ["Work shown", "Demolition + framing"],
      ["Record", "Field photography"],
    ],
    images: [
      {
        src: "/media/jzg/mob-pompano-demolition.webp",
        alt: "Controlled demolition underway at the MOB Pompano project",
        position: "center 45%",
      },
      {
        src: "/media/jzg/safety-containment.webp",
        alt: "Temporary containment inside the MOB Pompano medical-office project",
        position: "center",
      },
      {
        src: "/media/jzg/safety-air-control.webp",
        alt: "Air-control equipment used during MOB Pompano interior work",
        position: "center",
      },
    ],
    href: "/demolition/projects/healthcare",
  },
  {
    index: "03",
    title: "Development Portfolio",
    market: "JZ Development",
    location: "Florida",
    scope: "Acquisition through long-term operations",
    summary:
      "A reserved project record for the approved JZ Development opportunity selected for the public portfolio.",
    facts: [
      ["Company", "JZ Development"],
      ["Focus", "Full development lifecycle"],
      ["Record", "Pending client approval"],
    ],
    images: [
      {
        src: "/media/development/workforce-housing-kitchen.webp",
        alt: "Completed interior representing JZ Development capability",
        position: "center 45%",
      },
      {
        src: "/media/video/development-kitchen-poster.jpg",
        alt: "Completed workforce-housing kitchen interior",
        position: "center",
      },
      {
        src: "/media/video/development-interior-poster.jpg",
        alt: "Completed residential interior representing development operations",
        position: "center",
      },
    ],
    href: "/development/projects",
  },
] as const;

export const qualificationRecords = [
  {
    title: "Planning",
    description: "Access, work zones, material movement, sequencing, and turnover are defined around each site and scope.",
  },
  {
    title: "Field Leadership",
    description: "Clear supervision keeps the work controlled, documented, and coordinated with the project team and the trades that follow.",
  },
  {
    title: "Accountability",
    description: "Responsibility remains clear from planning through execution, closeout, and the handoff to the next phase.",
  },
] as const;
