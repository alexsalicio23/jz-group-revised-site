export const contact = {
  phoneDisplay: "(305) 793-2984",
  phoneHref: "tel:+13057932984",
  email: "estimating@jzdemo.com",
  address: "15219 NW 60th Ave, Miami Lakes, Florida 33014",
  officeLabel: "JZ Group office",
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
    media: "/media/jzg/mob-pompano-demolition.webp",
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
    poster: "/media/jzg/division-construction.webp",
    type: "video" as const,
  },
  {
    number: "03",
    slug: "waste-management",
    name: "JZ Waste Management",
    short: "Waste Management",
    kicker: "Keep material moving.",
    description:
      "Dumpsters, hauling, temporary fencing, and site cleanup coordinated around the pace of the work.",
    media: "/media/video/workflow-waste.mp4",
    poster: "/media/jzg/division-waste.webp",
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
    title: "MOB Pompano",
    market: "Medical office",
    location: "Pompano Beach, Florida",
    scope: "Demolition and framing field record",
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
    index: "02",
    title: "100 Biscayne",
    market: "Commercial construction",
    location: "South Florida",
    scope: "Interior planning and framing field record",
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
    index: "03",
    title: "Bascom Palmer",
    market: "Healthcare construction",
    location: "South Florida",
    scope: "Interior framing and buildout field record",
    summary:
      "Field photography showing interior framing, active coordination, and construction progress within a healthcare project.",
    facts: [
      ["Company", "JZ Construction"],
      ["Work shown", "Interior framing"],
      ["Record", "Field photography"],
    ],
    images: [
      {
        src: "/media/jzg/project-bascom-palmer.webp",
        alt: "Interior framing progress at the Bascom Palmer project",
        position: "center",
      },
      {
        src: "/media/jzg/field-bascom-action.webp",
        alt: "JZ field work underway at the Bascom Palmer project",
        position: "center",
      },
      {
        src: "/media/jzg/project-bascom-palmer-team.webp",
        alt: "JZ team coordination inside the Bascom Palmer project",
        position: "center",
      },
    ],
    href: "/construction/projects/healthcare",
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
