export type PresentationDivision = {
  slug: "demolition" | "construction" | "waste-management" | "development";
  number: string;
  name: string;
  shortName: string;
  statement: string;
  mediaLabel: string;
  capabilities: string[];
};

export const presentationDivisions: PresentationDivision[] = [
  {
    slug: "demolition",
    number: "01",
    name: "JZ Demolition",
    shortName: "Demolition",
    statement: "Controlled removal for active hospitals, occupied facilities, and difficult commercial scopes.",
    mediaLabel: "CONTROLLED DEMOLITION / LANDSCAPE PHOTO",
    capabilities: ["Selective demolition", "Interior demolition", "Concrete scanning and cutting", "Total demolition"],
  },
  {
    slug: "construction",
    number: "02",
    name: "JZ Construction",
    shortName: "Construction",
    statement: "Field execution from layout and framing through finishes, closeout, and turnover.",
    mediaLabel: "FIELD CONSTRUCTION / LANDSCAPE PHOTO",
    capabilities: ["General contracting", "Framing and drywall", "Ceilings and wall protection", "Concrete support"],
  },
  {
    slug: "waste-management",
    number: "03",
    name: "JZ Waste Management",
    shortName: "Waste Management",
    statement: "Containers, hauling, site cleanup, and material movement aligned with the project schedule.",
    mediaLabel: "SITE LOGISTICS / LANDSCAPE PHOTO",
    capabilities: ["Dumpster service", "Debris hauling", "Temporary fencing", "Site cleanup labor"],
  },
  {
    slug: "development",
    number: "04",
    name: "JZ Development",
    shortName: "Development",
    statement: "A long-term view of acquisition, planning, construction oversight, and property value.",
    mediaLabel: "COMPLETED DEVELOPMENT / LANDSCAPE PHOTO",
    capabilities: ["Acquisition", "Project planning", "Construction oversight", "Property management"],
  },
];

export const activeMethods = [
  {
    number: "01",
    title: "Plan",
    description: "Walk the site, document existing conditions, and define what comes out, what stays, and what must remain operational.",
    mediaLabel: "SITE WALK + PRECONSTRUCTION / 16:9",
  },
  {
    number: "02",
    title: "Protect",
    description: "Sequence access, material movement, and work zones around the people and systems that continue operating nearby.",
    mediaLabel: "PROTECTION + CONTAINMENT / 16:9",
  },
  {
    number: "03",
    title: "Execute",
    description: "Put experienced supervision, disciplined crews, and the right equipment behind a clearly controlled scope.",
    mediaLabel: "CONTROLLED FIELD EXECUTION / 16:9",
  },
  {
    number: "04",
    title: "Turn Over",
    description: "Clear the work area and leave the next trade with a clean, documented site that is ready for its next phase.",
    mediaLabel: "CLEAN TURNOVER / 16:9",
  },
] as const;

export type PresentationProject = {
  slug: string;
  index: string;
  title: string;
  market: string;
  location: string;
  scope: string;
  summary: string;
  facts: Array<{ label: string; value: string }>;
  mediaLabel: string;
};

export const presentationProjects: PresentationProject[] = [
  {
    slug: "baptist-medical-arts-4th-floor",
    index: "01",
    title: "Baptist Medical Arts Building",
    market: "Active healthcare",
    location: "South Florida",
    scope: "Fourth-floor selective interior demolition",
    summary: "A complex interior demolition scope planned around an active hospital environment and an overnight execution window.",
    facts: [
      { label: "Scope", value: "16,300 SF" },
      { label: "Condition", value: "Active hospital" },
      { label: "Execution", value: "Overnight" },
    ],
    mediaLabel: "BAPTIST MEDICAL ARTS / PROJECT PHOTO",
  },
  {
    slug: "broward-mob-pompano",
    index: "02",
    title: "Broward Medical Office Building",
    market: "Medical office",
    location: "Pompano Beach, Florida",
    scope: "Multi-floor interior demolition and concrete work",
    summary: "Three stories of interior demolition with concrete scanning and cutting coordinated within the same scope.",
    facts: [
      { label: "Building", value: "3 stories" },
      { label: "Scope", value: "Interior demolition" },
      { label: "Concrete", value: "Scanning + cutting" },
    ],
    mediaLabel: "BROWARD MOB / PROJECT PHOTO",
  },
  {
    slug: "workforce-housing-development",
    index: "03",
    title: "Workforce Housing Development",
    market: "Development",
    location: "Florida",
    scope: "Planning through construction oversight",
    summary: "A completed development representing JZ's long-term view of planning, execution, and lasting community value.",
    facts: [
      { label: "Division", value: "JZ Development" },
      { label: "Asset", value: "Workforce housing" },
      { label: "Status", value: "Completed" },
    ],
    mediaLabel: "WORKFORCE HOUSING / PROJECT PHOTO",
  },
];

export const qualificationTopics = [
  "Active-facility experience",
  "Site-specific planning",
  "Experienced field supervision",
  "Clean turnover to the next trade",
] as const;

export const directContacts = [
  { slug: "demolition", division: "JZ Demolition", email: "estimating@jzdemo.com" },
  { slug: "construction", division: "JZ Construction", email: "estimating@jzconstruction.com" },
  { slug: "waste-management", division: "JZ Waste Management", email: "estimating@jzwastemanagement.com" },
  { slug: "development", division: "JZ Development", email: "estimating@jzdevelopment.com" },
] as const;

export const groupContact = {
  phoneDisplay: "(305) 793-2984",
  phoneHref: "tel:+13057932984",
  address: "15219 NW 60th Ave, Miami Lakes, Florida 33014",
};
