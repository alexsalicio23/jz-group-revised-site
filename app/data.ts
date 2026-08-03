export const contact = {
  phoneDisplay: "(305) 793-2984",
  phoneHref: "tel:+13057932984",
  email: "estimating@jzdemo.com",
  address: "15219 NW 60th Ave, Miami Lakes, Florida 33014",
};

export const divisions = [
  {
    number: "01",
    name: "JZ Demolition",
    short: "Demolition",
    href: "/templates/demolition",
    kicker: "Define the cut.",
    description:
      "Selective interior, structural, and concrete demolition planned around active and occupied environments.",
    media: "/media/field-story/demolition-floor.webp",
    type: "image" as const,
  },
  {
    number: "02",
    name: "JZ Waste Management",
    short: "Waste",
    href: "/templates/waste-management",
    kicker: "Keep material moving.",
    description:
      "Dumpsters, hauling, temporary fencing, and site cleanup coordinated around the pace of the work.",
    media: "/media/video/workflow-waste.mp4",
    poster: "/media/field-story/waste-truck.webp",
    type: "video" as const,
  },
  {
    number: "03",
    name: "JZ Construction",
    short: "Construction",
    href: "/templates/construction",
    kicker: "Move the site forward.",
    description:
      "Framing, drywall, finishing, concrete support, and commercial construction delivered by the same group.",
    media: "/media/video/workflow-build.mp4",
    poster: "/media/field-story/hero-field.webp",
    type: "video" as const,
  },
  {
    number: "04",
    name: "JZ Development",
    short: "Development",
    href: "/templates/development",
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
  },
  {
    number: "02",
    title: "Protect",
    description: "Sequence the work around the facility, its people, and the operations that continue around us.",
  },
  {
    number: "03",
    title: "Execute",
    description: "Put experienced crews, clear supervision, and the right equipment behind the scope.",
  },
  {
    number: "04",
    title: "Turn over",
    description: "Clear the area and leave the next trade with a site that is ready for work.",
  },
];
