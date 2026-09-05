import type { TemplateSlug } from "@/app/templates/template-data";
import { contact } from "@/app/data";
import { buildContactIntentHref } from "@/app/contact/contact-intent";

export type Stat = { value: string; label: string };
export type MediaAsset = {
  src: string;
  alt: string;
  caption?: string;
  position?: string;
  poster?: string;
  type?: "image" | "video";
};

export type TeamMember = {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export type PortfolioProject = {
  name: string;
};

export type ContentCard = {
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  media?: MediaAsset;
};

export type Specification = {
  title: string;
  dimensions?: string[];
  bestFor: string[];
  requestHref?: string;
};

export type ContentSection = {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  cards?: ContentCard[];
  layout?: "default" | "project-grid" | "portfolio-grid" | "team-grid" | "company-grid";
  media?: MediaAsset;
  team?: TeamMember[];
  specifications?: Specification[];
  mediaLabel?: string;
  tone?: "paper" | "concrete" | "ink";
};

export type ContentAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type ContentPageData = {
  key: string;
  division?: TemplateSlug;
  path: string;
  category: "company" | "values" | "safety" | "service" | "team" | "projects" | "sector" | "contact";
  eyebrow: string;
  title: string;
  introduction: string;
  mediaLabel: string;
  heroMedia?: MediaAsset;
  projectNote?: string;
  stats?: Stat[];
  actions?: ContentAction[];
  sections: ContentSection[];
  faqs?: Array<{ question: string; answer: string }>;
  related?: ContentCard[];
  sourceUrl: string;
  /** Search-result title. Falls back to the page H1 when absent. */
  seoTitle?: string;
  /** Search-result description. Falls back to `introduction` when absent. */
  seoDescription?: string;
};

export const divisionContacts: Record<TemplateSlug, { email: string; address: string; officeLabel: string; phone: string }> = {
  demolition: {
    email: "estimating@jzdemo.com",
    address: contact.address,
    officeLabel: "JZ Demolition office",
    phone: "(305) 793-2984",
  },
  construction: {
    email: "estimating@jzconstruction.com",
    address: contact.address,
    officeLabel: "JZ Construction office",
    phone: "(305) 793-2984",
  },
  "waste-management": {
    email: "estimating@jzwastemanagement.com",
    address: contact.address,
    officeLabel: "JZ Waste Management office",
    phone: "(305) 793-2984",
  },
  development: {
    email: "estimating@jzdevelopment.com",
    address: contact.address,
    officeLabel: "JZ Development office",
    phone: "(305) 793-2984",
  },
};

export const divisionLabels: Record<TemplateSlug, string> = {
  demolition: "JZ Demolition",
  construction: "JZ Construction",
  "waste-management": "JZ Waste Management",
  development: "JZ Development",
};

export const groupPortfolioProjects: readonly PortfolioProject[] = [
  { name: "8030" },
  { name: "MHW CT1 & CT2" },
  { name: "JP Morgan Chase" },
  { name: "BHF MAP" },
  { name: "Rutledge Facade Demo" },
  { name: "Drew's Kitchen" },
  { name: "Luis Quintana House" },
  { name: "UMHT PY-B L4" },
  { name: "North Bay Village" },
  { name: "BHTP X-Ray RM 1 & 3" },
  { name: "MOB Pompano" },
  { name: "MCI Hallandale" },
  { name: "100 Biscayne" },
  { name: "JDCH CT Scan" },
  { name: "CCOC Vault Expansion" },
  { name: "MHW Cath Lab" },
  { name: "UMHT Penthouse" },
  { name: "UMHT OR Reno" },
  { name: "CSPD Phase 2" },
  { name: "UMHT Cath Lab" },
  { name: "UMHT PAC-U" },
];

const leadershipTeam: TeamMember[] = [
  {
    name: "Alex DeArmas",
    role: "President",
    image: "/media/jzg/team-alex-dearmas.webp",
    imageAlt: "Alex DeArmas, President of JZ Group",
  },
  { name: "Zeniada Balseiro", role: "Secretary" },
  {
    name: "Chris Carter",
    role: "Vice President",
    image: "/media/jzg/team-chris-carter.webp",
    imageAlt: "Chris Carter, Vice President of JZ Group",
  },
];

const operationsTeam: TeamMember[] = [
  {
    name: "Juan Machado",
    role: "Project Manager",
    image: "/media/jzg/team-juan-machado.webp",
    imageAlt: "Juan Machado, Project Manager at JZ Group",
  },
  {
    name: "Robert Rey",
    role: "Project Manager",
    image: "/media/jzg/team-robert-rey.webp",
    imageAlt: "Robert Rey, Project Manager at JZ Group",
  },
  {
    name: "Franja DeArmas",
    role: "Accountant",
    image: "/media/jzg/team-franja-dearmas.webp",
    imageAlt: "Franja DeArmas, Accountant at JZ Group",
  },
  {
    name: "Henry Monterrey",
    role: "Estimator",
    image: "/media/jzg/team-henry-monterrey.webp",
    imageAlt: "Henry Monterrey, Estimator at JZ Group",
  },
];

const fieldTeam: TeamMember[] = [
  {
    name: "Yacel Frontela",
    role: "Superintendent",
    image: "/media/jzg/team-yacel-frontela.webp",
    imageAlt: "Yacel Frontela, Superintendent at JZ Group",
  },
  {
    name: "Miguel Munoz",
    role: "Superintendent",
    image: "/media/jzg/team-miguel-munoz.webp",
    imageAlt: "Miguel Munoz, Superintendent at JZ Group",
  },
  { name: "Alejandro Osorio", role: "Superintendent" },
  { name: "Freddy Oleva", role: "Foreman" },
  { name: "Lazaro Pérez", role: "Foreman" },
  { name: "Yunier Fernandez", role: "Foreman" },
];

export const groupPages: Record<string, ContentPageData> = {
  about: {
    key: "about",
    seoTitle: "About JZ Group | Four Coordinated Companies",
    seoDescription:
      "How a family drywall business became four coordinated companies, the leadership behind them, and the operating standard that applies across all of them.",
    path: "about",
    category: "company",
    eyebrow: "JZ Group / Company",
    title: "Built on Family",
    introduction:
      "JZ Group is the umbrella for four coordinated companies spanning demolition, general contracting, subcontracting, waste management, and development.",
    mediaLabel: "JZ GROUP TEAM PHOTO",
    heroMedia: {
      src: "/media/jzg/group-field-team.webp",
      alt: "JZ Group field team inside an active commercial project",
      position: "center 42%",
    },
    actions: [{ label: "Meet the four companies", href: "/#group" }],
    sections: [
      {
        id: "history",
        eyebrow: "Our history",
        title: "Founder - Jorge Balseiro",
        paragraphs: [
          "Jorge Balseiro began his entrepreneurial journey in 1998 after arriving in the United States from Cuba with his family. His dedication and work ethic fueled the establishment of J.Z. Drywall Inc., a business known for quality and reliability.",
          "In 2021, Jorge partnered with his grandson, Alexander DeArmas, to launch JZ Demolition. Together they carried a commitment to excellence, family, and innovation into a new generation of the construction industry.",
          "Jorge passed away in June 2023 after a brief battle with cancer. His resilience, vision, and commitment to his family's future continue through JZ Group and the companies it has grown to support.",
        ],
        mediaLabel: "FOUNDER / JORGE BALSEIRO",
      },
      {
        id: "mission",
        eyebrow: "Our mission",
        title: "Four Companies",
        paragraphs: [
          "JZ Demolition delivers specialty, selective, total, structural, robotic, and concrete demolition. JZ Construction operates as both a general contractor and a subcontractor. JZ Waste Management supports contractors with hauling and site logistics. JZ Development carries opportunities from planning into long-term operations.",
          "The shared group structure creates clearer ownership across planning, field execution, material movement, closeout, and the next phase of the project.",
        ],
      },
      {
        id: "standards",
        title: "One Standard",
        cards: [
          { title: "Safety", description: "Plan the work around the site, the people, and the conditions that remain active around it." },
          { title: "Integrity", description: "Communicate clearly, own the responsibility, and make project decisions visible." },
          { title: "Execution", description: "Put experienced leadership, field capability, and disciplined follow-through behind the scope." },
          { title: "Long-term thinking", description: "Treat every handoff, relationship, and completed project as part of a larger future." },
        ],
      },
      {
        id: "leadership",
        title: "Leadership",
        layout: "team-grid",
        team: leadershipTeam,
      },
      {
        id: "operations",
        title: "Project and office operations",
        layout: "team-grid",
        team: operationsTeam,
      },
      {
        id: "field",
        title: "Field leadership",
        paragraphs: [
          "JZ Group hires verified, experienced people and relies on field leadership to manage work according to project requirements, schedule, safety expectations, and the conditions around each scope.",
        ],
        layout: "team-grid",
        team: fieldTeam,
      },
    ],
    related: [
      { title: "Group standards", subtitle: "Safety, integrity, excellence, and community", href: "/values" },
      { title: "Safety", subtitle: "The operating standard behind the work", href: "/safety" },
      { title: "Across JZ projects", subtitle: "Browse work by company and market", href: "/projects" },
    ],
    sourceUrl: "https://www.jz-groupmiami.com/about-us",
  },
  values: {
    key: "values",
    seoTitle: "JZ Group Values: Safety, Integrity, Excellence",
    seoDescription:
      "One operating standard across four companies: safety protocols, honest communication, dependable follow-through, and respect for the surrounding community.",
    path: "values",
    category: "values",
    eyebrow: "JZ Group / Standards",
    title: "One Operating Standard",
    introduction:
      "The divisions have different responsibilities, but they operate around the same expectations: safety, integrity, excellence, and a positive impact on the communities around the work.",
    mediaLabel: "FOUR COMPANIES / ONE GROUP PHOTO",
    heroMedia: {
      src: "/media/jzg/group-field-team.webp",
      alt: "Four JZ Group field team members coordinating work inside a commercial project",
      position: "center 42%",
    },
    sections: [
      {
        id: "standards",
        eyebrow: "Core values",
        title: "Our Commitments",
        cards: [
          {
            title: "Safety first",
            description:
              "Every project is approached with safety protocols intended to protect the team, the client, the public, and the operations around the work.",
          },
          {
            title: "Integrity",
            description:
              "JZ Group operates with honesty, accountability, and transparency, including clear communication and dependable follow-through.",
          },
          {
            title: "Excellence",
            description:
              "Planning, execution, cleanup, craftsmanship, and reliability are treated as parts of the same deliverable.",
          },
          {
            title: "Community commitment",
            description:
              "The work affects more than buildings. JZ Group aims to support safer, cleaner, and stronger communities through every service lane.",
          },
        ],
      },
      {
        id: "one-group",
        eyebrow: "The operating model",
        title: "Aligned by One Standard",
        paragraphs: [
          "JZ Demolition defines and clears the scope. JZ Waste Management keeps material and site logistics moving. JZ Construction carries the project into the build. JZ Development extends the view through planning, delivery, and long-term value.",
          "Bringing these services under one organization reduces unnecessary vendor handoffs and creates clearer accountability across cost, schedule, execution, and closeout.",
        ],
      },
    ],
    related: [
      { title: "Meet the group", subtitle: "Company history and leadership", href: "/about" },
      { title: "Safety", subtitle: "Planning for active environments", href: "/safety" },
      { title: "Discuss a project", subtitle: "Route the scope to the right division", href: "/contact" },
    ],
    sourceUrl: "https://www.jz-groupmiami.com/",
  },
  safety: {
    key: "safety",
    seoTitle: "Safety Program for Occupied Facilities | JZ Group",
    seoDescription:
      "Site assessment, hazard review, containment, access control and turnover for work inside active hospitals and occupied buildings in South Florida.",
    path: "safety",
    category: "safety",
    eyebrow: "JZ Group / Safety",
    title: "Safety at Every Step",
    introduction:
      "Across demolition, construction, waste operations, and development oversight, safe work begins with site-specific planning, experienced field leadership, and visible accountability.",
    mediaLabel: "APPROVED SAFETY / PROTECTION SETUP",
    heroMedia: {
      src: "/media/jzg/safety-containment.webp",
      alt: "Temporary containment protecting an occupied medical-office corridor",
      position: "center",
    },
    stats: [
      { value: "1998", label: "Legacy begins" },
      { value: "Florida", label: "Licensed" },
      { value: "Statewide", label: "Project coverage" },
    ],
    sections: [
      {
        id: "planning",
        eyebrow: "Before work begins",
        title: "Active Facilities",
        paragraphs: [
          "JZ's public operating approach begins with site assessment, hazard review, logistics planning, and clear definition of the work zone. Access, sequencing, material movement, occupied areas, and turnover requirements are considered before production begins.",
          "The operating approach is tailored to the company, project, facility, and scope. Current licenses, insurance, bonding, training records, references, and project-specific requirements are available through a qualification request.",
        ],
        bullets: [
          "Site and hazard assessment",
          "Access and logistics planning",
          "Work-zone protection",
          "Crew communication and supervision",
          "Clean, deliberate turnover",
        ],
      },
      {
        id: "active-facilities",
        eyebrow: "Active environments",
        title: "Site Controls",
        paragraphs: [
          "Active hospitals and occupied facilities require an operating plan shaped around access, people, retained systems, material movement, noise, dust, debris, and turnover.",
          "Specific controls are selected and verified for the project rather than presented as one generic procedure for every environment.",
        ],
        mediaLabel: "ACTIVE FACILITY CONTROL DETAIL",
        media: {
          src: "/media/jzg/safety-air-control.webp",
          alt: "Air-control equipment supporting contained work inside an occupied medical-office environment",
          position: "center",
        },
      },
      {
        id: "field-readiness",
        eyebrow: "Field readiness",
        title: "Field Accountability",
        paragraphs: [
          "Field leadership is responsible for making the plan visible at the point of work, coordinating with the project team, and keeping accountability clear as conditions change.",
          "Request the current qualification package for verified credentials, insurance, bonding, training records, safety information, and references relevant to the proposed scope.",
        ],
      },
    ],
    related: [
      { title: "Active hospital demolition", subtitle: "JZ Demolition", href: "/demolition/projects/healthcare" },
      { title: "Request qualifications", subtitle: "Estimating", href: "/contact" },
    ],
    sourceUrl: "https://www.jz-groupmiami.com/",
  },
  projects: {
    key: "projects",
    seoTitle: "Demolition, Construction and Development Projects | JZ Group",
    seoDescription:
      "Selected JZ Group demolition, construction and development work across healthcare, commercial, multifamily and complex project environments in Florida.",
    path: "projects",
    category: "projects",
    eyebrow: "JZ Group / Work",
    title: "Selected Work",
    introduction:
      "Open a project for a quick record, then continue to the responsible JZ company for deeper capabilities and comparable work.",
    mediaLabel: "FEATURED ACROSS JZ PROJECTS",
    heroMedia: {
      src: "/media/jzg/project-100-biscayne.webp",
      alt: "A JZ team member reviewing construction drawings at 100 Biscayne",
      position: "center 46%",
    },
    sections: [
      {
        id: "portfolio",
        title: "Project Portfolio",
        layout: "portfolio-grid",
      },
      {
        id: "markets",
        eyebrow: "Explore by company",
        title: "Browse by Company",
        layout: "company-grid",
        cards: [
          { title: "JZ Demolition", subtitle: "Specialty, selective, total and concrete demolition", href: "/demolition/projects", media: { src: "/media/jzg/mob-pompano-demolition.webp", alt: "Controlled demolition underway at MOB Pompano", position: "center 45%" } },
          { title: "JZ Construction", subtitle: "General contracting and subcontracting", href: "/construction/projects", media: { src: "/media/jzg/project-100-biscayne.webp", alt: "JZ Construction reviewing plans at 100 Biscayne", position: "center 46%" } },
          { title: "JZ Waste Management", subtitle: "Contractor hauling and site logistics", href: "/waste-management", media: { src: "/media/jzg/division-waste.webp", alt: "JZ Waste Management truck serving a South Florida jobsite" } },
          { title: "JZ Development", subtitle: "Development and long-term operations", href: "/development/projects", media: { src: "/media/development/workforce-housing-kitchen.webp", alt: "Completed interior from a JZ Development property" } },
        ],
      },
    ],
    related: [
      { title: "JZ Demolition projects", subtitle: "Healthcare, education, commercial, and retail", href: "/demolition/projects", media: { src: "/media/jzg/mob-pompano-demolition.webp", alt: "Controlled demolition underway at MOB Pompano", position: "center 45%" } },
      { title: "JZ Construction projects", subtitle: "Healthcare and commercial work", href: "/construction/projects", media: { src: "/media/jzg/project-100-biscayne.webp", alt: "JZ Construction reviewing plans at 100 Biscayne", position: "center 46%" } },
      { title: "JZ Development projects", subtitle: "South Florida development portfolio", href: "/development/projects", media: { src: "/media/development/workforce-housing-kitchen.webp", alt: "Completed interior from a JZ Development property" } },
    ],
    sourceUrl: "https://www.jzdemolition.com/portfolio",
  },
  services: {
    key: "services",
    seoTitle: "Construction, Demolition and Site Services | JZ Group",
    seoDescription:
      "Compare JZ Group general contracting, demolition, interior trade, waste management, site logistics and development capabilities across Florida.",
    path: "services",
    category: "service",
    eyebrow: "JZ Group / Services",
    title: "Group Services",
    introduction:
      "Start with the work you need. JZ Group routes general contracting, demolition, interior trades, site logistics, and development opportunities to the right company.",
    mediaLabel: "JZ GROUP FIELD OPERATIONS",
    heroMedia: {
      src: "/media/website-photos/jz-group-field-operations.webp",
      alt: "JZ Group field operations on a commercial project",
      position: "center 48%",
    },
    actions: [{ label: "Send a scope", href: "/contact" }],
    sections: [
      {
        id: "construction",
        title: "General Contracting",
        paragraphs: [
          "JZ Construction leads new construction, renovation, preconstruction, project management, and closeout while also supporting projects through in-house interior trade capability.",
        ],
        cards: [
          { title: "General contracting", description: "Project leadership from preconstruction through closeout.", href: "/construction/services/general-contracting" },
          { title: "Interior trades", description: "Framing, drywall, ceilings, Division 10, and supporting scopes.", href: "/construction/services/subcontracting" },
          { title: "Construction projects", description: "Review healthcare, commercial, and developing project records.", href: "/construction/projects" },
        ],
      },
      {
        id: "demolition",
        title: "Demolition",
        paragraphs: [
          "JZ Demolition handles specialty and selective interiors, total and structural removal, site preparation, robotic demolition, and concrete work.",
        ],
        cards: [
          { title: "Interior demolition", description: "Controlled removal in occupied and sensitive environments.", href: "/demolition/services/interior-demolition" },
          { title: "Total demolition", description: "Complete and structural removal with deliberate sequencing.", href: "/demolition/services/total-demolition" },
          { title: "Concrete services", description: "Scanning, cutting, breaking, and coordinated removal.", href: "/demolition/services/concrete-work" },
        ],
      },
      {
        id: "logistics",
        title: "Site Logistics",
        paragraphs: [
          "JZ Waste Management provides dumpsters, hauling, temporary fencing, cleanup labor, recycling coordination, and contractor-led site support.",
        ],
        cards: [
          { title: "Dumpsters and hauling", description: "Container service and material movement paced to production.", href: "/waste-management/services/dumpster-rentals" },
          { title: "Temporary fencing", description: "Perimeter support for active construction environments.", href: "/waste-management/services/temporary-fencing" },
          { title: "Cleanup labor", description: "Ongoing and final cleanup support for contractor-led work.", href: "/waste-management/services/general-labor" },
        ],
      },
      {
        id: "development",
        title: "Development",
        paragraphs: [
          "JZ Development carries opportunities through acquisition, planning, construction oversight, property operations, and long-term ownership.",
        ],
        cards: [
          { title: "Development platform", description: "Review the full lifecycle and current company positioning.", href: "/development" },
          { title: "Development portfolio", description: "Explore publicly available South Florida project records.", href: "/development/projects" },
          { title: "Discuss an opportunity", description: "Route a partnership or development conversation directly to JZ.", href: "/contact?for=development" },
        ],
      },
    ],
    related: [
      { title: "Selected work", subtitle: "Review projects across the group", href: "/projects", media: { src: "/media/jzg/project-100-biscayne.webp", alt: "JZ team member reviewing project plans at 100 Biscayne", position: "center 46%" } },
      { title: "Qualifications", subtitle: "Review the standards behind delivery", href: "/safety", media: { src: "/media/jzg/safety-containment.webp", alt: "Temporary containment protecting an occupied medical-office corridor" } },
      { title: "Contact JZ", subtitle: "Send one scope for routing", href: "/contact", media: { src: "/media/jzg/group-field-team.webp", alt: "JZ Group field team inside a commercial project", position: "center 42%" } },
    ],
    sourceUrl: "https://www.jzgroupmiami.com/",
  },
  contact: {
    key: "contact",
    seoTitle: "Request an Estimate | JZ Group Miami",
    seoDescription:
      "Send the project type, location, facility status, timeline and documents once. We route demolition, construction, waste and development inquiries.",
    path: "contact",
    category: "contact",
    eyebrow: "JZ Group / Estimating",
    title: "Send Your Scope",
    introduction:
      "Share the project type, location, facility status, timeline, and available documents. The group can route demolition, construction, waste management, and development inquiries from one intake.",
    mediaLabel: "ESTIMATING / PRECONSTRUCTION TEAM PHOTO",
    heroMedia: {
      src: "/media/jzg/project-100-biscayne.webp",
      alt: "A JZ team member reviewing project drawings",
      position: "center 45%",
    },
    sections: [
      {
        id: "contacts",
        eyebrow: "Direct contacts",
        title: "Contact JZ",
        cards: [
          { title: "JZ Demolition", subtitle: "estimating@jzdemo.com", href: "mailto:estimating@jzdemo.com" },
          { title: "JZ Construction", subtitle: "estimating@jzconstruction.com", href: "mailto:estimating@jzconstruction.com" },
          { title: "JZ Waste Management", subtitle: "estimating@jzwastemanagement.com", href: "mailto:estimating@jzwastemanagement.com" },
          { title: "JZ Development", subtitle: "estimating@jzdevelopment.com", href: "mailto:estimating@jzdevelopment.com" },
        ],
        paragraphs: [
          "Phone: (305) 793-2984",
          `Group office: ${contact.address}`,
        ],
      },
    ],
    sourceUrl: "https://www.jz-groupmiami.com/",
  },
};

const demolitionRelated: ContentCard[] = [
  { title: "Interior demolition", subtitle: "Occupied and sensitive environments", href: "/demolition/services/interior-demolition" },
  { title: "Total demolition", subtitle: "Selective and complete structural removal", href: "/demolition/services/total-demolition" },
  { title: "Concrete work", subtitle: "Scanning, cutting, and repairs", href: "/demolition/services/concrete-work" },
  { title: "Waste hauling", subtitle: "In-house material movement", href: "/demolition/services/waste-hauling" },
];

const demolitionPages: ContentPageData[] = [
  {
    key: "demolition/about",
    seoTitle: "About JZ Demolition | Miami Demolition Contractor",
    seoDescription:
      "A South Florida demolition contractor built around clear communication, controlled execution, dependable scheduling and respect for the property around it.",
    division: "demolition",
    path: "about",
    category: "company",
    eyebrow: "JZ Demolition / Our story",
    title: "Built to Clear the Way",
    introduction:
      "JZ Demolition is a South Florida demolition contractor built around clear communication, controlled execution, dependable scheduling, and respect for the people and property around the work.",
    mediaLabel: "JZ DEMOLITION COMPANY PHOTO",
    actions: [
      {
        label: "Download capability statement",
        href: "https://www.jzdemolition.com/_files/ugd/2c1cbc_f1ed8316d25d40109fcb315aa5d3fbf9.pdf",
        external: true,
      },
    ],
    sections: [
      {
        id: "founder",
        eyebrow: "Company story",
        title: "Founder - Jorge Balseiro",
        paragraphs: [
          "Jorge Balseiro began his entrepreneurial journey in 1998 after arriving in the United States from Cuba with his family. His dedication and tireless work ethic fueled the establishment of J.Z. Drywall Inc., a business known for quality and reliability.",
          "Motivated by his family, Jorge partnered with his grandson, Alexander DeArmas, to launch JZ Demolition in 2021. Together they carried a commitment to excellence and innovation into a new generation of the construction industry.",
          "Jorge passed away in June 2023 after a brief battle with cancer. His resilience, determination, and vision continue through the family, the team, and the JZ Group businesses he helped inspire.",
        ],
        mediaLabel: "FOUNDER / JORGE BALSEIRO",
      },
      {
        id: "mission",
        eyebrow: "Our mission",
        title: "Demolition You Can Trust",
        paragraphs: [
          "JZ Demolition's mission is to simplify every phase of demolition through clear communication, transparent pricing, and professional execution from start to finish. The company is focused on dependable solutions that align with each client's schedule, budget, and project goals.",
          "The team views demolition as the foundation of progress. Selective interior demolition, structural teardown, and site clearing are planned around precision, integrity, industry experience, and respect for the surrounding community.",
        ],
      },
      {
        id: "who-we-are",
        eyebrow: "Who we are",
        title: "Hands-On Leadership",
        paragraphs: [
          "JZ Demolition works with contractors, developers, and property owners across South Florida. The team brings hands-on experience in structural demolition, selective interior demolition, site clearing, complete building removals, interior gut-outs, and debris hauling.",
          "Modern equipment, efficient methods, and close communication allow the company to tailor its approach to both smaller renovations and large commercial scopes while keeping the site safe, organized, and ready for what follows.",
        ],
      },
      {
        id: "values",
        eyebrow: "Core values",
        title: "How We Work",
        cards: [
          { title: "Integrity", description: "Honest communication, transparent pricing, clear proposals, realistic timelines, and straightforward updates." },
          { title: "Efficiency", description: "Modern techniques, skilled operators, and coordinated workflows designed to reduce downtime and keep projects moving." },
          { title: "Safety", description: "Clean, secure job sites supported by training, equipment awareness, planning, communication, and OSHA-aligned practices." },
          { title: "Sustainability", description: "Material recovery, recycling, waste tracking, and responsible handling intended to reduce landfill impact and support LEED goals." },
          { title: "Expertise", description: "Technical understanding of structural demolition, selective removal, site clearing, equipment, and sequencing." },
          { title: "Innovation", description: "Advanced equipment, technology, and project-management practices applied to safer and more efficient removal." },
        ],
      },
      {
        id: "relationships",
        eyebrow: "How we work",
        title: "Built on Relationships",
        paragraphs: [
          "JZ Demolition believes a successful project begins with open communication, precise planning, and commitment to safety and client satisfaction. The goal is a professional, environmentally responsible service that makes the next phase easier for the project team.",
        ],
      },
    ],
    related: demolitionRelated,
    sourceUrl: "https://www.jzdemolition.com/about-us",
  },
  {
    key: "demolition/services/interior-demolition",
    seoTitle: "Interior Demolition in Occupied Buildings | Miami",
    seoDescription:
      "Interior demolition planned around what stays: structure, adjacent finishes, building systems, occupied areas and the schedule for the next trade.",
    division: "demolition",
    path: "services/interior-demolition",
    category: "service",
    eyebrow: "JZ Demolition / Interior demolition",
    title: "Interior Demolition",
    introduction:
      "Interior demolition is planned around what must stay: structure, adjacent finishes, building systems, facility operations, people, access, and the schedule for the next trade.",
    mediaLabel: "INTERIOR DEMOLITION / ACTIVE FACILITY",
    stats: [
      { value: "Active", label: "Healthcare environments" },
      { value: "Selective", label: "Walls, ceilings, floors, and systems" },
      { value: "Clean", label: "Work-ready turnover" },
    ],
    sections: [
      {
        id: "preparation",
        eyebrow: "01 / Prepare",
        title: "Job-site preparation",
        paragraphs: [
          "Every interior selective-demolition project begins with planning, hazard assessment, and coordinated safety measures, especially in occupied or sensitive buildings. The team plans the removal of walls, ceilings, flooring, and mechanical systems while preserving structural integrity and limiting disruption to surrounding areas.",
          "JZ protects adjacent finishes, controls dust and noise, and uses containment methods to establish a clean and compliant work zone. Hospital wings, office renovations, and retail remodels are prepared for the next construction phase with the same focus on safety and readiness.",
        ],
        mediaLabel: "SITE PROTECTION / CONTAINMENT SETUP",
      },
      {
        id: "interior-gut",
        eyebrow: "02 / Clear",
        title: "Interior gut",
        paragraphs: [
          "Complete interior-gut services cover commercial, residential, and institutional spaces, with particular experience in active healthcare environments. Scope can include drywall, flooring, fixtures, ceilings, finishes, and interior systems.",
          "JZ coordinates sequencing and communication with the facility and project team, and its public service information describes infection-control coordination, dust containment, noise mitigation, negative-air systems, and clean work-zone practices intended to reduce impact on patient care and daily operations.",
          "The result is a controlled transition from existing space to a clear, construction-ready interior.",
        ],
      },
      {
        id: "selective",
        eyebrow: "03 / Select",
        title: "Selective interior demolition",
        paragraphs: [
          "Selective demolition removes specific components while preserving surrounding structures and active systems. The work can range from limited renovations to full-floor gut-outs in hospitals, medical facilities, offices, and commercial buildings.",
          "JZ coordinates with facility management, hospital staff, infection-control teams, general contractors, and adjacent trades to maintain secure work zones and keep the demolition sequence aligned with the overall project schedule.",
        ],
      },
    ],
    faqs: [
      { question: "What sets JZ Demolition apart from other demolition contractors?", answer: "JZ combines skilled crews, specialty experience, equipment, and in-house waste management to deliver controlled work in sensitive and high-traffic environments." },
      { question: "How is safety maintained during interior demolition?", answer: "The public JZ process begins with a site assessment, safety plan, and containment setup. Depending on the verified project plan, barriers, negative-air equipment, and HEPA filtration may be used to control dust and debris." },
      { question: "What happens after interior demolition is complete?", answer: "The team completes cleanup and debris removal so the area is clear for the next construction phase. Waste-hauling and recycling documentation can be coordinated when required." },
      { question: "How does JZ manage cost efficiency?", answer: "Careful planning helps avoid unnecessary labor, delays, and waste. In-house dumpsters, equipment, and hauling reduce third-party handoffs and give the team more control of workflow." },
      { question: "How does JZ coordinate with general contractors and other trades?", answer: "Demolition schedules, access, material movement, and turnover are coordinated with the GC, project managers, facility stakeholders, and adjacent trades." },
    ],
    related: demolitionRelated.filter((item) => item.href !== "/demolition/services/interior-demolition"),
    sourceUrl: "https://www.jzdemolition.com/interior-demolition",
  },
  {
    key: "demolition/services/total-demolition",
    seoTitle: "Structural and Total Demolition Services | Miami",
    seoDescription:
      "Structural demolition from assessment, utility coordination and permitting through a sequence that protects surrounding property and clears the site.",
    division: "demolition",
    path: "services/total-demolition",
    category: "service",
    eyebrow: "JZ Demolition / Total demolition",
    title: "Structural Demolition",
    introduction:
      "Total-demolition work begins with assessment, utility coordination, environmental review, permitting, logistics, and a sequence that protects surrounding property and prepares the site for its next use.",
    mediaLabel: "TOTAL DEMOLITION / STRUCTURAL REMOVAL",
    sections: [
      {
        id: "preparation",
        eyebrow: "01 / Prepare",
        title: "Job-site preparation",
        paragraphs: [
          "Before equipment moves on site, JZ completes hazard assessments, utility verification, environmental evaluation, access planning, and logistics review. The team coordinates utility disconnections, barricades, fencing, and the removal of initial obstructions to establish a controlled work area.",
          "The project plan addresses applicable OSHA, EPA, and local requirements along with dust, noise, runoff, and environmental controls tailored to the site.",
        ],
        mediaLabel: "SITE PREPARATION / PERIMETER CONTROL",
      },
      {
        id: "selective-total",
        eyebrow: "02 / Separate",
        title: "Selective total demolition",
        paragraphs: [
          "Selective total demolition can remove specific portions of commercial, industrial, or residential structures while protecting the areas that remain. The work includes structural separation, debris removal, and final cleanup.",
          "JZ works with owners, engineers, contractors, and authorities to plan clean separations, meet regulatory requirements, and limit impact on adjacent buildings and active areas.",
        ],
      },
      {
        id: "complete-removal",
        eyebrow: "03 / Remove",
        title: "Complete structural demolition",
        paragraphs: [
          "Complete structural demolition covers planning, permitting, equipment, personnel, teardown, material handling, and site cleanup. Detailed sequencing and on-site management support structures of different sizes and complexity.",
          "JZ coordinates with property owners, contractors, engineers, and municipalities while keeping schedule, budget, recycling, and site restoration visible throughout the work.",
        ],
      },
    ],
    faqs: [
      { question: "What differentiates JZ's total-demolition service?", answer: "In-house hauling, a safety-focused operating culture, specialty experience, and control of logistics allow demolition and debris movement to work as one sequence." },
      { question: "What happens to demolition debris?", answer: "Materials are sorted, recycled where appropriate, hauled, and disposed of through the coordinated waste-management process." },
      { question: "Can JZ work in tight or urban environments?", answer: "JZ's public service information describes controlled demolition in confined and high-traffic settings using precision equipment, dust suppression, and deliberate sequencing." },
      { question: "How are environmental concerns handled?", answer: "The process begins with environmental review and project-specific controls for dust, noise, runoff, and regulated materials. Specialized hazardous-material work is assigned to appropriately certified parties." },
      { question: "Are demolition materials recycled?", answer: "JZ states that concrete, steel, asphalt, and other recoverable materials are separated and recycled where practical to reduce landfill use." },
    ],
    related: demolitionRelated.filter((item) => item.href !== "/demolition/services/total-demolition"),
    sourceUrl: "https://www.jzdemolition.com/copy-of-interior-demolition",
  },
  {
    key: "demolition/services/concrete-work",
    seoTitle: "Concrete Cutting, Scanning and Removal | Miami",
    seoDescription:
      "Concrete scanning, cutting, selective removal, pour-backs and repairs coordinated around structural integrity, hidden systems and dust control.",
    division: "demolition",
    path: "services/concrete-work",
    category: "service",
    eyebrow: "JZ Demolition / Concrete work",
    title: "Concrete Services",
    introduction:
      "Concrete scanning, cutting, selective removal, pour-backs, and repairs are coordinated around structural integrity, hidden building systems, dust and vibration control, and the needs of active facilities.",
    mediaLabel: "CONCRETE SCANNING / CUTTING / REPAIR",
    sections: [
      {
        id: "scanning",
        eyebrow: "01 / Locate",
        title: "Concrete scanning",
        paragraphs: [
          "JZ's concrete scanning service uses Ground-Penetrating Radar technology to locate embedded utilities, reinforcement, conduit, and post-tension cables before cutting, coring, or removal begins.",
          "The non-destructive process provides real-time information for hospitals, schools, offices, and commercial buildings. Trained technicians use the findings to guide safer decisions, reduce avoidable damage, and keep work aligned with structural and safety requirements.",
        ],
        mediaLabel: "GPR SCANNING IN ACTIVE FACILITY",
      },
      {
        id: "cutting",
        eyebrow: "02 / Cut",
        title: "Concrete cutting",
        paragraphs: [
          "Walls, slabs, floors, and new openings are cut with precision tools selected for the scope. Each operation is planned around adjacent structure, dust, debris, vibration, access, and ongoing activity around the work.",
          "Cutting can support renovation, expansion, system installation, and selective demolition while preserving surrounding conditions and maintaining a controlled workflow.",
        ],
      },
      {
        id: "robotic-demolition",
        eyebrow: "Robotic capability",
        title: "Robotic Demolition",
        paragraphs: [
          "JZ Demolition's capabilities include remote demolition for demanding access, concrete, and production conditions.",
          "Share the concrete scope, site access, and surrounding operations with the team to discuss whether robotic demolition is appropriate for the work. Method selection is reviewed alongside scanning, cutting, protection, and material-removal planning.",
        ],
      },
      {
        id: "repairs",
        eyebrow: "03 / Restore",
        title: "Concrete repairs",
        paragraphs: [
          "Concrete repair can address surface cracks, spalling, weakened slabs, walls, columns, trench work, and other corrective scopes. The process begins with assessment and selection of a repair strategy appropriate to the condition.",
          "Industry-approved materials, preparation, reinforcement, placement, and finishing methods are used to restore safety, stability, and long-term performance while limiting disruption around the work.",
        ],
      },
    ],
    faqs: [
      { question: "Why scan before cutting or coring?", answer: "Scanning identifies hidden utilities, rebar, conduit, and post-tension cables so cuts can be planned safely and costly damage can be avoided." },
      { question: "How are accuracy and safety maintained during cutting?", answer: "The team combines site assessment, scanning information, precision saws, trained technicians, and dust and vibration controls." },
      { question: "What concrete damage can be repaired?", answer: "Public JZ service information includes surface cracks, spalling, weakened slabs, walls, and columns." },
      { question: "Can concrete work occur in occupied buildings?", answer: "Yes. The process is planned to control dust, debris, noise, and disruption in active offices, schools, hospitals, and commercial sites." },
      { question: "How are durable results supported?", answer: "Work is based on assessment, technical planning, proper preparation, industry-approved materials, and coordinated execution." },
    ],
    related: demolitionRelated.filter((item) => item.href !== "/demolition/services/concrete-work"),
    sourceUrl: "https://www.jzdemolition.com/copy-of-total-demolition",
  },
  {
    key: "demolition/services/waste-hauling",
    seoTitle: "Demolition Debris Hauling and Site Cleanup | Miami",
    seoDescription:
      "In-house dumpsters, trucks and crews move demolition debris on the demolition schedule instead of waiting on an unrelated third-party hauler.",
    division: "demolition",
    path: "services/waste-hauling",
    category: "service",
    eyebrow: "JZ Demolition / In-house hauling",
    title: "Debris Hauling",
    introduction:
      "JZ Demolition uses in-house dumpsters, hauling trucks, and waste-management support to move debris with the demolition sequence instead of waiting on an unrelated third party.",
    mediaLabel: "JZ HAULING FLEET / ACTIVE JOBSITE",
    sections: [
      {
        id: "self-service",
        eyebrow: "01 / Control",
        title: "Self-performed hauling support",
        paragraphs: [
          "In-house equipment and personnel give the demolition team greater control of schedule, safety, site cleanliness, and material movement. Debris can be removed as production advances so work areas remain organized and clear.",
          "JZ also describes sorting concrete, metal, wood, and other recoverable material to support landfill diversion, environmental reporting, and project-specific sustainability goals.",
        ],
        mediaLabel: "DUMPSTER / TRUCK / MATERIAL ROUTE",
      },
      {
        id: "leed",
        eyebrow: "02 / Document",
        title: "LEED-aligned material tracking",
        paragraphs: [
          "The public JZ waste-hauling program describes material sorting, load tracking, documentation, and project-specific waste-management planning intended to support green-building and LEED requirements.",
          "Direct control of hauling can improve response time, simplify communication, and make disposal and recycling records easier to coordinate with contractors, developers, and environmental consultants.",
        ],
      },
      {
        id: "rentals",
        eyebrow: "03 / Support",
        title: "Dumpster and container rentals",
        paragraphs: [
          "Containers support commercial, residential, renovation, construction, and demolition scopes across South Florida. Placement, service, swaps, pickup, and disposal are coordinated around jobsite access and production needs.",
          "Flexible sizing and responsive turnaround give contractors and owners one source for the container and hauling work surrounding demolition.",
        ],
      },
    ],
    faqs: [
      { question: "What makes the in-house hauling model different?", answer: "Demolition and hauling can share one schedule, one safety plan, and one field communication path, reducing third-party delays and coordination gaps." },
      { question: "How is debris disposal managed?", answer: "JZ states that its team follows applicable disposal requirements, separates recyclable materials, and maintains load documentation for accountability." },
      { question: "Can hauling follow active demolition production?", answer: "Yes. Containers, swaps, and hauling are coordinated with the actual pace of removal so debris does not become a site bottleneck." },
      { question: "How does hauling support sustainability?", answer: "Material separation, recycling, landfill diversion, and transparent documentation support project sustainability and LEED goals." },
      { question: "How quickly can containers be delivered or swapped?", answer: "The current public site states that most deliveries and swaps can be scheduled within 24 hours, subject to availability and project conditions." },
    ],
    related: [
      { title: "JZ Waste Management", subtitle: "Full contractor-support services", href: "/waste-management" },
      ...demolitionRelated.filter((item) => item.href !== "/demolition/services/waste-hauling").slice(0, 3),
    ],
    sourceUrl: "https://www.jzdemolition.com/copy-of-concrete-work",
  },
  {
    key: "demolition/projects",
    seoTitle: "Demolition Projects: Healthcare, Education, Retail",
    seoDescription:
      "Demolition work across healthcare, education, commercial and retail environments in South Florida, organized by the kind of facility it happened in.",
    division: "demolition",
    path: "projects",
    category: "projects",
    eyebrow: "JZ Demolition / Portfolio",
    title: "Demolition Projects",
    introduction:
      "JZ Demolition's public portfolio spans healthcare, education, business and community, retail and entertainment, along with commercial, industrial, and residential work across South Florida.",
    mediaLabel: "DEMOLITION PROJECT GALLERY COVER",
    sections: [
      {
        id: "sectors",
        eyebrow: "View by sector",
        title: "Browse by Market",
        cards: [
          { title: "Healthcare", subtitle: "Selected public experience", description: "Sensitive medical environments, active hospitals, clinic clear-outs, and occupied interior renovation work.", href: "/demolition/projects/healthcare" },
          { title: "Education", subtitle: "Selected public experience", description: "Active campuses, classroom renovations, and full-building interior gut work.", href: "/demolition/projects/education" },
          { title: "Business / Community", subtitle: "Selected public experience", description: "Offices, restaurants, housing, mixed-use property, and community environments.", href: "/demolition/projects/business-community" },
          { title: "Retail / Entertainment", subtitle: "Selected public experience", description: "Stores, shopping environments, fitness spaces, and entertainment facilities.", href: "/demolition/projects/retail-entertainment" },
        ],
      },
      {
        id: "approach",
        eyebrow: "Across the portfolio",
        title: "Every Scale",
        paragraphs: [
          "From selective interior tear-outs to complete structural removals, JZ approaches each project around safety, quality, environmental responsibility, modern equipment, and a clean site prepared for the next construction phase.",
        ],
        mediaLabel: "APPROVED DEMOLITION PROJECT MOSAIC",
      },
    ],
    related: demolitionRelated,
    sourceUrl: "https://www.jzdemolition.com/portfolio",
  },
  {
    key: "demolition/projects/healthcare",
    seoTitle: "Hospital and Healthcare Demolition in Miami | JZ",
    seoDescription:
      "Demolition inside active hospitals and clinics across South Florida, planned around patient care, staff movement and services that keep running.",
    division: "demolition",
    path: "projects/healthcare",
    category: "sector",
    eyebrow: "JZ Demolition / Healthcare",
    title: "Healthcare Demolition",
    introduction:
      "Healthcare demolition is performed in environments where patient care, staff movement, building systems, and essential services may continue directly beside the work.",
    mediaLabel: "ACTIVE HEALTHCARE DEMOLITION",
    stats: [
      { value: "Selected", label: "Public healthcare experience" },
      { value: "Occupied", label: "Facility coordination" },
      { value: "Active", label: "Hospital experience" },
    ],
    sections: [
      {
        id: "experience",
        eyebrow: "Healthcare experience",
        title: "Built Around Care",
        paragraphs: [
          "JZ Demolition specializes in sensitive medical environments, from interior-floor renovations to clinic clear-outs. Crews coordinate closely with facility stakeholders and contractors to reduce disruption to patients, staff, access, and essential services.",
          "Each project creates the controlled foundation for new healthcare space through safety, efficiency, reliability, and respect for the operating environment.",
        ],
        cards: [
          { title: "Baptist Health" },
          { title: "UHealth" },
          { title: "Memorial Healthcare" },
          { title: "Broward Health" },
          { title: "Jackson Health" },
          { title: "Nicklaus Children's Hospital" },
          { title: "Joe DiMaggio Children's Hospital" },
        ],
        mediaLabel: "HEALTHCARE PROJECT GALLERY",
      },
    ],
    related: [
      { title: "Interior demolition", href: "/demolition/services/interior-demolition" },
      { title: "Education work", href: "/demolition/projects/education" },
      { title: "Request comparable references", href: "/contact?for=demolition" },
    ],
    sourceUrl: "https://www.jzdemolition.com/health-care",
  },
  {
    key: "demolition/projects/education",
    seoTitle: "School and Campus Demolition in South Florida",
    seoDescription:
      "Classroom and campus demolition sequenced around students, staff, campus operations and the renovation schedule, from single rooms to full interiors.",
    division: "demolition",
    path: "projects/education",
    category: "sector",
    eyebrow: "JZ Demolition / Education",
    title: "Education Demolition",
    introduction:
      "Educational demolition requires clean work zones, deliberate sequencing, and communication that protects students, staff, campus operations, and the schedule for renovation.",
    mediaLabel: "EDUCATION DEMOLITION PROJECT",
    stats: [
      { value: "Selected", label: "Public education experience" },
      { value: "Occupied", label: "Campus coordination" },
      { value: "Active", label: "Campus coordination" },
    ],
    sections: [
      {
        id: "experience",
        eyebrow: "Education experience",
        title: "Active Campuses",
        paragraphs: [
          "JZ's education work ranges from classroom renovation to full-building interior gut scopes. The team coordinates with school administrators, contractors, and project stakeholders to limit disruption while maintaining safety and cleanliness.",
          "Every completed scope helps prepare the way for learning environments built on accountability, precision, and trust.",
        ],
        cards: [
          { title: "Gulliver Prep" },
          { title: "Columbus High School" },
          { title: "Miami Dade College" },
          { title: "Florida International University" },
        ],
        mediaLabel: "EDUCATION PROJECT GALLERY",
      },
    ],
    related: [
      { title: "Healthcare work", href: "/demolition/projects/healthcare" },
      { title: "Business / Community", href: "/demolition/projects/business-community" },
      { title: "Send an education scope", href: "/contact?for=demolition" },
    ],
    sourceUrl: "https://www.jzdemolition.com/education",
  },
  {
    key: "demolition/projects/business-community",
    seoTitle: "Office and Restaurant Demolition in Miami | JZ",
    seoDescription:
      "Interior demolition for offices, restaurants, housing, mixed-use and community property, coordinated with property managers around neighbouring occupants.",
    division: "demolition",
    path: "projects/business-community",
    category: "sector",
    eyebrow: "JZ Demolition / Business and community",
    title: "Commercial Demolition",
    introduction:
      "Office, restaurant, residential, mixed-use, and community demolition scopes are coordinated around productivity, neighboring occupants, property operations, access, and the project schedule.",
    mediaLabel: "BUSINESS / COMMUNITY PROJECT",
    stats: [
      { value: "Selected", label: "Public commercial experience" },
      { value: "Occupied", label: "Tenant coordination" },
      { value: "Clean", label: "Operational coordination" },
    ],
    sections: [
      {
        id: "experience",
        eyebrow: "Commercial experience",
        title: "Business Continuity",
        paragraphs: [
          "JZ performs interior demolition for offices, corporate spaces, restaurants, housing, mixed-use property, and community environments. Work ranges from reconfiguration to full interior renovation and is coordinated with property managers and contractors.",
          "The objective is a clean, on-schedule scope that limits interruption and prepares a functional foundation for the next use.",
        ],
        cards: [
          { title: "Offices" },
          { title: "Restaurants" },
          { title: "Single-family homes" },
          { title: "Apartments / Condominiums" },
          { title: "Community facilities" },
        ],
        mediaLabel: "BUSINESS / COMMUNITY GALLERY",
      },
    ],
    related: [
      { title: "Retail / Entertainment", href: "/demolition/projects/retail-entertainment" },
      { title: "Total demolition", href: "/demolition/services/total-demolition" },
      { title: "Send a commercial scope", href: "/contact?for=demolition" },
    ],
    sourceUrl: "https://www.jzdemolition.com/business",
  },
  {
    key: "demolition/projects/retail-entertainment",
    seoTitle: "Retail and Entertainment Demolition in Miami",
    seoDescription:
      "Store, mall and entertainment demolition planned around patrons, neighbouring tenants, property operations and the deadlines that shape an opening.",
    division: "demolition",
    path: "projects/retail-entertainment",
    category: "sector",
    eyebrow: "JZ Demolition / Retail and entertainment",
    title: "Retail Demolition",
    introduction:
      "Retail and entertainment work is planned around patrons, neighboring tenants, access, property operations, cleanliness, and the deadlines that shape openings and renovations.",
    mediaLabel: "RETAIL / ENTERTAINMENT PROJECT",
    stats: [
      { value: "Selected", label: "Public retail experience" },
      { value: "Occupied", label: "Property coordination" },
      { value: "Active", label: "Commercial environments" },
    ],
    sections: [
      {
        id: "experience",
        eyebrow: "Retail experience",
        title: "Customer Environments",
        paragraphs: [
          "JZ supports store renovations, shopping environments, fitness facilities, entertainment spaces, and complex clear-outs. The team coordinates with property managers, developers, contractors, and adjacent businesses to maintain safe, clean conditions and limit interruption.",
          "Each scope is approached around efficiency, reliability, and a controlled transition into the next build phase.",
        ],
        cards: [
          { title: "Luxury shopping districts" },
          { title: "Malls and shops" },
          { title: "Fitness / Entertainment" },
        ],
        mediaLabel: "RETAIL / ENTERTAINMENT GALLERY",
      },
    ],
    related: [
      { title: "Business / Community", href: "/demolition/projects/business-community" },
      { title: "Interior demolition", href: "/demolition/services/interior-demolition" },
      { title: "Send a retail scope", href: "/contact?for=demolition" },
    ],
    sourceUrl: "https://www.jzdemolition.com/retail",
  },
];

const wasteRelated: ContentCard[] = [
  { title: "Dumpster rentals", subtitle: "15, 20, and 30-yard options", href: "/waste-management/services/dumpster-rentals" },
  { title: "Temporary fencing", subtitle: "6 and 8-foot site protection", href: "/waste-management/services/temporary-fencing" },
  { title: "General labor", subtitle: "Cleanup and material support", href: "/waste-management/services/general-labor" },
  { title: "Recycling", subtitle: "Construction scrap-metal recovery", href: "/waste-management/services/recycling" },
];

const wastePages: ContentPageData[] = [
  {
    key: "waste-management/about",
    seoTitle: "About JZ Waste Management | South Florida",
    seoDescription:
      "Dumpsters, debris hauling, temporary fencing, recycling and site labor for contractors, businesses and property owners across South Florida.",
    division: "waste-management",
    path: "about",
    category: "company",
    eyebrow: "JZ Waste Management / Our story",
    title: "Reliable Site Support",
    introduction:
      "JZ Waste Management supports contractors, businesses, property owners, and homeowners with dumpsters, debris hauling, temporary fencing, recycling, and labor across South Florida.",
    mediaLabel: "JZ WASTE MANAGEMENT FLEET / TEAM",
    sections: [
      {
        id: "who-we-are",
        eyebrow: "Who we are",
        title: "Beyond the Dumpster",
        paragraphs: [
          "Every jobsite and cleanup comes with its own access, timing, and material challenges. JZ Waste Management has built its service around being available when the project needs support, from container delivery and debris hauling to temporary fencing and hands-on cleanup.",
          "The company works with contractors and businesses across South Florida and tailors service around the job rather than forcing every project into the same schedule or package.",
        ],
        mediaLabel: "WASTE MANAGEMENT OPERATIONS PHOTO",
      },
      {
        id: "mission",
        eyebrow: "Our mission",
        title: "Simple Site Cleanup",
        paragraphs: [
          "JZ Waste Management's mission is to deliver waste removal and site services with clear pricing, reliable response, and professional support. The company emphasizes no hidden fees, no unnecessary delays, and solutions aligned with the project's timeline and budget.",
          "From residential renovation to full commercial debris hauling, the goal is to remove the cleanup burden so the project team can remain focused on production.",
        ],
      },
      {
        id: "reliability",
        eyebrow: "Driven by reliability",
        title: "Hands-On Support",
        paragraphs: [
          "The team delivers dumpsters, clears debris, secures job sites, and provides labor support with an emphasis on consistency, safety, and on-time service. Dependable equipment and a direct operating model help make cleanup more predictable.",
        ],
        cards: [
          { title: "Integrity", description: "Honest, transparent service with no hidden fees." },
          { title: "Reliability", description: "On-time deliveries and pickups aligned with the project." },
          { title: "Efficiency", description: "Responsive site solutions designed to keep work moving." },
          { title: "Safety", description: "Clean, secure job sites that protect people and property." },
        ],
      },
    ],
    related: wasteRelated,
    sourceUrl: "https://www.jzwastemanagement.com/about-us",
  },
  {
    key: "waste-management/services/dumpster-rentals",
    seoTitle: "Roll-Off Dumpster Rental in Miami and Fort Lauderdale",
    seoDescription:
      "Roll-off dumpsters for construction, demolition, roofing, renovation and property cleanouts across Miami, Fort Lauderdale and West Palm Beach.",
    division: "waste-management",
    path: "services/dumpster-rentals",
    category: "service",
    eyebrow: "JZ Waste Management / Dumpster rentals",
    title: "Dumpster Rentals",
    introduction:
      "Roll-off dumpsters for construction, demolition, roofing, renovation, concrete disposal, and large property cleanouts across Miami, Fort Lauderdale, West Palm Beach, and surrounding South Florida communities.",
    mediaLabel: "ROLL-OFF CONTAINER / DELIVERY PHOTO",
    stats: [
      { value: "15 yd", label: "Compact projects" },
      { value: "20 yd", label: "Renovation work" },
      { value: "30 yd", label: "High-volume debris" },
    ],
    sections: [
      {
        id: "service",
        eyebrow: "Reliable dumpster service",
        title: "Built Around the Site",
        paragraphs: [
          "JZ offers multiple dumpster sizes and flexible rental options for residential and commercial work. Fast delivery, clear pickup schedules, and upfront pricing are intended to make waste removal predictable.",
          "Containers can handle wood, drywall, concrete, metal, asphalt, roofing material, and other construction debris subject to the confirmed rental terms. Delivery, placement, swaps, and pickup are coordinated to keep the site safe and productive.",
        ],
        mediaLabel: "CONTAINER PLACEMENT / JOBSITE ACCESS",
      },
      {
        id: "sizes",
        eyebrow: "Container guide",
        title: "Container Sizes",
        specifications: [
          {
            title: "15-yard pull trailer",
            requestHref: buildContactIntentHref({ division: "waste-management", inquiry: "rental", container: "15-trailer" }),
            dimensions: ["15 ft length", "8 ft width", "6 ft height"],
            bestFor: ["Tight driveways and restricted access", "Neighborhood placement limits", "Smaller renovation or cleanup jobs", "Sites where a dumpster cannot remain overnight"],
          },
          {
            title: "15-yard roll-off bin",
            requestHref: buildContactIntentHref({ division: "waste-management", inquiry: "rental", container: "15-rolloff" }),
            dimensions: ["15 ft length", "8 ft width", "4 ft height"],
            bestFor: ["Small to medium renovations", "Garage, attic, or property cleanouts", "Roofing projects", "Landscaping and yard debris"],
          },
          {
            title: "20-yard roll-off bin",
            requestHref: buildContactIntentHref({ division: "waste-management", inquiry: "rental", container: "20-rolloff" }),
            dimensions: ["20 ft length", "8 ft width", "4 ft height"],
            bestFor: ["Medium construction and remodeling", "Roofing or flooring removal", "Multi-room renovation", "Sites where a container can remain for several days"],
          },
          {
            title: "30-yard roll-off bin",
            requestHref: buildContactIntentHref({ division: "waste-management", inquiry: "rental", container: "30-rolloff" }),
            dimensions: ["20 ft length", "8 ft width", "6 ft height"],
            bestFor: ["Large construction and demolition", "Major cleanouts and commercial remodels", "Bulky or high-volume material", "Longer projects requiring hauling efficiency"],
          },
        ],
      },
    ],
    faqs: [
      { question: "What size dumpster do I need?", answer: "A 15-yard container often fits smaller cleanup work, a 20-yard option fits many renovations and roofing scopes, and a 30-yard container supports larger construction projects. JZ can confirm the best fit from the material and access conditions." },
      { question: "Are concrete-specific dumpsters available?", answer: "Yes. The current public service page lists concrete-specific container support for heavy material such as concrete, asphalt, and brick." },
      { question: "How is rental pricing determined?", answer: "Pricing depends on container size, material type, rental duration, location, and service frequency. JZ states that quotes are provided up front without hidden fees." },
      { question: "How quickly can a dumpster be delivered?", answer: "The current public site states that same-day or next-day delivery is available in many cases across the service area, subject to schedule and availability." },
    ],
    related: wasteRelated.filter((item) => item.href !== "/waste-management/services/dumpster-rentals"),
    sourceUrl: "https://www.jzwastemanagement.com/d",
  },
  {
    key: "waste-management/services/temporary-fencing",
    seoTitle: "Temporary Construction Fence Rental | South Florida",
    seoDescription:
      "Temporary fence rental for active construction and demolition sites in South Florida, including delivery, setup, removal and privacy screening.",
    division: "waste-management",
    path: "services/temporary-fencing",
    category: "service",
    eyebrow: "JZ Waste Management / Temporary fencing",
    title: "Temporary Fencing",
    introduction:
      "Temporary fence rentals for active construction and demolition sites across South Florida, including delivery, setup, removal, flexible rental periods, and optional privacy screening.",
    mediaLabel: "TEMPORARY FENCE / ACTIVE JOBSITE",
    stats: [
      { value: "6 ft", label: "Standard height option" },
      { value: "8 ft", label: "Enhanced height option" },
      { value: "5 / 10 ft", label: "Panel widths" },
    ],
    sections: [
      {
        id: "service",
        eyebrow: "Site security",
        title: "Site Protection",
        paragraphs: [
          "JZ provides 6-foot and 8-foot temporary fence panels for construction sites in Miami, Fort Lauderdale, West Palm Beach, and surrounding South Florida areas. Applications include equipment protection, material security, controlled access, dust control, privacy, and separation from hazardous zones.",
          "The team coordinates delivery, installation, rental duration, privacy screens, and removal. Green and orange screening options are listed on the current public service page.",
        ],
        mediaLabel: "FENCE INSTALLATION / SCREENING",
      },
      {
        id: "panel-options",
        eyebrow: "Panel guide",
        title: "Fence Options",
        specifications: [
          { title: "6 ft high x 5 ft wide", dimensions: ["6 ft height", "5 ft width"], bestFor: ["Compact construction spaces", "Controlled walkways and entry points", "Smaller work areas and material protection", "Restricted-access zones"] },
          { title: "8 ft high x 5 ft wide", dimensions: ["8 ft height", "5 ft width"], bestFor: ["Compact sites requiring a taller barrier", "Controlled access", "Added privacy and security", "Hazardous-zone separation"] },
          { title: "6 ft high x 10 ft wide", dimensions: ["6 ft height", "10 ft width"], bestFor: ["General construction-site security", "Work-area and material protection", "Quick setup", "Short-term projects"] },
          { title: "8 ft high x 10 ft wide", dimensions: ["8 ft height", "10 ft width"], bestFor: ["Heavy-duty protection", "Large commercial or industrial sites", "Valuable equipment and material", "Privacy and safety-compliance needs"] },
        ],
      },
    ],
    faqs: [
      { question: "What fence heights are available?", answer: "JZ's current public inventory includes 6-foot and 8-foot panel options in 5-foot and 10-foot widths." },
      { question: "Does JZ install the fencing?", answer: "Yes. Delivery, setup, and removal are included in the available service." },
      { question: "Can privacy screens or windscreens be added?", answer: "Yes. Privacy and wind-screening options are available for dust control, security, and site appearance." },
      { question: "How long can fencing be rented?", answer: "Short-term and longer-term rental programs are available and can be aligned with the project schedule." },
      { question: "What areas are served?", answer: "The public service area includes Miami, Fort Lauderdale, West Palm Beach, and surrounding South Florida communities." },
    ],
    related: wasteRelated.filter((item) => item.href !== "/waste-management/services/temporary-fencing"),
    sourceUrl: "https://www.jzwastemanagement.com/temporary-fencing",
  },
  {
    key: "waste-management/services/general-labor",
    seoTitle: "Construction Site Cleanup Labor | South Florida",
    seoDescription:
      "Semi-skilled crews for cleanup, debris movement, material handling, egress maintenance and day-to-day site organization across South Florida.",
    division: "waste-management",
    path: "services/general-labor",
    category: "service",
    eyebrow: "JZ Waste Management / General labor",
    title: "Site Cleanup Labor",
    introduction:
      "Semi-skilled labor for cleanup, debris movement, material handling, egress maintenance, dust-control support, and day-to-day site organization across South Florida.",
    mediaLabel: "GENERAL LABOR / SITE CLEANUP CREW",
    sections: [
      {
        id: "support",
        eyebrow: "Reliable labor support",
        title: "Field Support",
        paragraphs: [
          "JZ laborers support construction and demolition projects with sweeping, mopping, debris pickup, material movement, common-area maintenance, sticky-mat service, and clear egress routes.",
          "Crews can unload deliveries, move material into or around the site, organize debris into containers, and separate recyclable from non-recyclable material. Flexible scheduling and hourly labor rates allow the service to scale with project demand.",
        ],
        mediaLabel: "CLEANUP / MATERIAL HANDLING",
      },
      {
        id: "services",
        eyebrow: "Services offered",
        title: "Support Services",
        cards: [
          { title: "General cleaning", description: "Sweeping, mopping, egress maintenance, sticky-mat service, and upkeep of common areas." },
          { title: "Jobsite clearing", description: "Debris organization, loading containers, hauling material, and separating recyclable and non-recyclable waste." },
          { title: "Material handling", description: "Unloading deliveries and moving supplies to the locations required by the project team." },
        ],
      },
    ],
    faqs: [
      { question: "What work can the general labor team perform?", answer: "Semi-skilled workers assist with cleanup, debris hauling, sweeping, material movement, and egress maintenance. They do not perform licensed electrical, plumbing, or structural trade work." },
      { question: "How is general labor billed?", answer: "The current public service page describes an hourly rate per person so labor can be matched to the time and manpower required." },
      { question: "How quickly can a crew be scheduled?", answer: "JZ states that crews may be available within 24 to 48 hours, while larger or longer-term needs should be scheduled in advance." },
      { question: "Are workers trained for site safety?", answer: "JZ states that laborers receive safe-work-practice training for debris handling, egress maintenance, and the site-support tasks they perform." },
    ],
    related: wasteRelated.filter((item) => item.href !== "/waste-management/services/general-labor"),
    sourceUrl: "https://www.jzwastemanagement.com/general-labors",
  },
  {
    key: "waste-management/services/recycling",
    seoTitle: "Construction Scrap Metal Recycling | South Florida",
    seoDescription:
      "Construction scrap-metal recycling focused on steel, aluminum and copper generated by demolition and construction projects across South Florida.",
    division: "waste-management",
    path: "services/recycling",
    category: "service",
    eyebrow: "JZ Waste Management / Recycling",
    title: "Material Recycling",
    introduction:
      "Construction scrap-metal recycling focused on steel, aluminum, and copper generated by demolition and construction projects across South Florida.",
    mediaLabel: "SCRAP METAL SORTING / RECYCLING",
    sections: [
      {
        id: "recycling",
        eyebrow: "Material recovery",
        title: "Metal Recovery",
        paragraphs: [
          "JZ collects, separates, and hauls construction-specific metal from project sites so steel, aluminum, and copper can be processed and returned to the supply chain when possible.",
          "The service supports cleaner jobsites, environmental compliance, reduced landfill use, resource conservation, and more organized debris management for contractors.",
        ],
        mediaLabel: "METAL COLLECTION / SEPARATION",
      },
      {
        id: "leed",
        eyebrow: "Sustainability",
        title: "Project Documentation",
        paragraphs: [
          "JZ's public recycling program describes landfill diversion and material tracking intended to support LEED Construction Waste Management and Materials and Resources goals.",
          "The same separation and recycling practices are applied to JZ's own construction and demolition work as well as client jobsites.",
        ],
      },
    ],
    faqs: [
      { question: "Why is scrap-metal recycling important?", answer: "It can reduce landfill waste and disposal cost while improving jobsite organization and returning valuable material to the supply chain." },
      { question: "What metals does JZ recycle?", answer: "The public program focuses on construction-related steel, aluminum, and copper." },
      { question: "How does the service support sustainability?", answer: "Material is separated and diverted from landfill where practical, conserving resources and supporting a circular material flow." },
      { question: "Does JZ recycle material from its own projects?", answer: "Yes. The company states that the same metal-recovery practices are used on internal demolition and construction work." },
    ],
    related: wasteRelated.filter((item) => item.href !== "/waste-management/services/recycling"),
    sourceUrl: "https://www.jzwastemanagement.com/recycling-service",
  },
];

const constructionRelated: ContentCard[] = [
  { title: "General contracting", subtitle: "Preconstruction through delivery", href: "/construction/services/general-contracting" },
  { title: "Subcontracting", subtitle: "Drywall, ceilings, specialties, concrete, and waste", href: "/construction/services/subcontracting" },
  { title: "Healthcare work", subtitle: "Sensitive medical environments", href: "/construction/projects/healthcare" },
  { title: "Commercial work", subtitle: "Retail, offices, and active facilities", href: "/construction/projects/commercial" },
];

const constructionPages: ContentPageData[] = [
  {
    key: "construction/about",
    seoTitle: "About JZ Construction | Miami General Contractor",
    seoDescription:
      "From trade contractor to an integrated general-contracting and subcontracting platform serving healthcare, commercial and mixed-use work in South Florida.",
    division: "construction",
    path: "about",
    category: "company",
    eyebrow: "JZ Construction / Our story",
    title: "Built in the Field",
    introduction:
      "JZ Construction developed from a trade-contractor foundation into an integrated general-contracting and subcontracting platform serving healthcare, commercial, mixed-use, and specialty work across South Florida.",
    mediaLabel: "JZ CONSTRUCTION COMPANY PHOTO",
    actions: [
      {
        label: "Download capability statement",
        href: "https://cd69062a-6a13-4280-91d2-da36797c0a8c.filesusr.com/ugd/2c1cbc_836ddbeba34742ccbed53f169862198a.pdf",
        external: true,
      },
    ],
    sections: [
      {
        id: "story",
        eyebrow: "Company story",
        title: "Built on Accountability",
        paragraphs: [
          "JZ Construction grew from the disciplined management, clear communication, and dependable field performance established through JZ's demolition work. Clients increasingly relied on the team to manage complex scopes and coordinate beyond a single trade.",
          "That demand led JZ to expand into additional trades, consulting, owner representation, and full-service construction. The integrated model gives project teams more continuity across planning, field coordination, schedule, safety, and execution.",
          "The company has expanded from a healthcare-focused contractor into broader commercial, mixed-use, and specialty construction markets while retaining the operating discipline that established its early client relationships.",
        ],
        mediaLabel: "CONSTRUCTION LEADERSHIP / FIELD PHOTO",
      },
      {
        id: "mission",
        eyebrow: "Our mission",
        title: "A Clearer Build",
        paragraphs: [
          "JZ Construction guides clients from consulting and preconstruction through ground-up work, renovation, specialty trades, and final delivery. Clear communication, transparent expectations, and professional execution are intended to reduce confusion and delay.",
          "Precision, integrity, and expertise shape preconstruction, owner representation, project management, subcontracting, and in-house field services. The goal is a smooth, safe project aligned with budget, schedule, and the owner's priorities.",
        ],
      },
      {
        id: "values",
        eyebrow: "Core values",
        title: "How We Work",
        cards: [
          { title: "Integrity", description: "Clear proposals, realistic schedules, honest communication, and dependable follow-through." },
          { title: "Efficiency", description: "Planning, trade coordination, skilled field execution, and workflows designed to reduce downtime." },
          { title: "Safety", description: "Site-specific planning, training, accountability, PPE, inspections, and proactive field communication." },
          { title: "Sustainability", description: "Material recovery, waste tracking, and construction practices intended to reduce environmental impact." },
          { title: "Expertise", description: "Leadership across planning, project management, field production, and specialty trade execution." },
          { title: "Innovation", description: "Digital tools, construction technology, and process improvement used to create a more predictable project." },
        ],
      },
      {
        id: "relationships",
        eyebrow: "How we work",
        title: "Built as Partners",
        paragraphs: [
          "JZ Construction focuses on long-term relationships with owners, contractors, consultants, and communities. Planning, coordination, consulting, and field management are used to keep the client's goals visible from the first conversation through final completion.",
        ],
      },
    ],
    related: constructionRelated,
    sourceUrl: "https://chris16166.wixsite.com/website/about-us",
  },
  {
    key: "construction/services/general-contracting",
    seoTitle: "General Contracting and Preconstruction | Miami",
    seoDescription:
      "Preconstruction, project management, owner representation and safety oversight coordinated as one general-contracting lane in Miami-Dade and Broward.",
    division: "construction",
    path: "services/general-contracting",
    category: "service",
    eyebrow: "JZ Construction / General contracting",
    title: "General Contracting",
    introduction:
      "Preconstruction, project management, owner representation, consulting, and safety oversight coordinated as one general-contracting service lane.",
    mediaLabel: "GENERAL CONTRACTING / PROJECT TEAM",
    sections: [
      {
        id: "preconstruction",
        eyebrow: "01 / Preconstruction",
        title: "Preconstruction",
        paragraphs: [
          "JZ works with owners, architects, and engineers on cost estimating, budgeting, constructability review, design-document evaluation, value analysis, risk identification, and procurement planning.",
          "Logistics, site access, phasing, lead times, material selection, and sequencing are addressed early so the delivery plan begins with fewer unknowns and a stronger path to execution.",
        ],
        mediaLabel: "PRECONSTRUCTION / PLAN REVIEW",
      },
      {
        id: "project-management",
        eyebrow: "02 / Project management",
        title: "Project Leadership",
        paragraphs: [
          "Project managers coordinate trades, schedules, resources, subcontractors, quality control, owners, designers, and field teams. Cost tracking, change management, documentation, and detailed scheduling keep responsibilities and decisions visible.",
          "The structured approach is intended to identify challenges before they affect progress and give clients clear communication while JZ manages the day-to-day complexity of construction.",
        ],
      },
      {
        id: "owners-rep",
        eyebrow: "03 / Owner representation",
        title: "Owner Representation",
        paragraphs: [
          "Owner's Representative and consulting services protect the client's interests across planning, budgeting, scheduling, contractor coordination, contractual requirements, and financial expectations.",
          "Independent analysis, constructability input, risk assessment, stakeholder communication, and progress monitoring help owners maintain control and make informed decisions throughout the project lifecycle.",
        ],
      },
      {
        id: "safety",
        eyebrow: "04 / Safety",
        title: "Site Safety",
        paragraphs: [
          "JZ Construction runs a safety program built around training, accountability, applicable OSHA requirements, safety meetings, job-hazard analysis, site inspection, corrective action, and active participation from management and field personnel.",
        ],
      },
    ],
    related: constructionRelated.filter((item) => item.href !== "/construction/services/general-contracting"),
    sourceUrl: "https://chris16166.wixsite.com/website/interior-demolition",
  },
  {
    key: "construction/services/subcontracting",
    seoTitle: "Drywall, Framing and Ceiling Subcontractor | Miami",
    seoDescription:
      "Drywall and framing, acoustical ceilings, wall protection, Division 10 specialties and concrete, self-performed inside one subcontracting platform.",
    division: "construction",
    path: "services/subcontracting",
    category: "service",
    eyebrow: "JZ Construction / Subcontracting",
    title: "Subcontracting",
    introduction:
      "Drywall and framing, acoustical ceilings, wall protection, Division 10 specialties, concrete work, and waste support coordinated inside one subcontracting platform.",
    mediaLabel: "SUBCONTRACTING / INTERIOR BUILD-OUT",
    sections: [
      {
        id: "drywall",
        eyebrow: "01 / Drywall",
        title: "Framing through finish.",
        paragraphs: [
          "JZ provides metal and wood framing, insulation, backing, drywall installation, taping, and finish work. Layout, code-compliant systems, sound control, energy performance, and in-wall support are coordinated with architectural and specialty requirements.",
          "Sequencing with adjacent trades supports clean, consistent finishes and alignment with design, performance, and schedule requirements.",
        ],
        mediaLabel: "METAL FRAMING / DRYWALL INSTALLATION",
      },
      {
        id: "act",
        eyebrow: "02 / ACT",
        title: "Acoustical ceiling systems.",
        paragraphs: [
          "Scope includes layout, suspension systems, specialty ceiling configurations, acoustical panels, and tile installation for commercial and institutional spaces.",
          "Lighting, HVAC, fire protection, and other ceiling-mounted systems are coordinated for accessibility, code compliance, acoustic performance, manufacturer requirements, and a finished appearance.",
        ],
      },
      {
        id: "specialties",
        eyebrow: "03 / Wall protection and Division 10",
        title: "Wall Protection",
        paragraphs: [
          "JZ installs wall panels, corner guards, handrails, and impact-resistant wall-protection systems for healthcare and hospital environments where durability, safety, hygiene, and patient support are critical.",
          "Products are installed to manufacturer and facility requirements with attention to alignment, attachment, trade coordination, appearance, and long-term performance.",
        ],
      },
      {
        id: "concrete",
        eyebrow: "04 / Concrete",
        title: "Concrete Support",
        paragraphs: [
          "Concrete services begin with scanning for embedded utilities, reinforcement, and post-tension systems. Controlled removal, slab penetrations, trenches, pour-backs, reinforcement, preparation, and finishing are coordinated around the engineer's requirements and surrounding construction.",
        ],
      },
      {
        id: "waste",
        eyebrow: "05 / Waste",
        title: "In-house roll-off and hauling support.",
        paragraphs: [
          "Container delivery, scheduled and on-demand hauling, and responsible disposal are coordinated around the construction schedule. Direct control can reduce downtime, simplify logistics, and maintain cleaner, safer job sites.",
        ],
      },
      {
        id: "safety",
        eyebrow: "06 / Safety",
        title: "Training, certification, and active oversight.",
        paragraphs: [
          "JZ's public subcontracting program states that field personnel use appropriate PPE and follow site-specific safety requirements. The workforce is described as maintaining CPR and first-aid credentials, OSHA 30-hour training, and equipment certifications for aerial lifts, forklifts, and telehandlers, supported by toolbox talks and safety oversight.",
        ],
      },
    ],
    related: constructionRelated.filter((item) => item.href !== "/construction/services/subcontracting"),
    sourceUrl: "https://chris16166.wixsite.com/website/copy-of-interior-demolition",
  },
  {
    key: "construction/projects",
    seoTitle: "Construction Projects: Healthcare and Commercial",
    seoDescription:
      "Healthcare and commercial construction across South Florida: interior build-outs, clinic renovations and work inside occupied, high-traffic properties.",
    division: "construction",
    path: "projects",
    category: "projects",
    eyebrow: "JZ Construction / Portfolio",
    title: "Construction Projects",
    introduction:
      "Healthcare and commercial construction across South Florida: interior build-outs, clinic renovations, and work inside occupied, high-traffic properties.",
    mediaLabel: "JZ CONSTRUCTION PROJECT GALLERY",
    sections: [
      {
        id: "sectors",
        eyebrow: "View by sector",
        title: "Browse by Market",
        cards: [
          { title: "Healthcare", subtitle: "Selected public experience", description: "Medical build-outs and clinic renovations in sensitive, active environments.", href: "/construction/projects/healthcare" },
          { title: "Commercial", subtitle: "Selected public experience", description: "Retail, entertainment, office, and active commercial construction.", href: "/construction/projects/commercial" },
        ],
      },
      {
        id: "delivery",
        eyebrow: "Integrated delivery",
        title: "One Project Record",
        paragraphs: [
          "JZ Construction combines planning and project management with in-house drywall, framing, ceilings, specialties, concrete, and waste support. That operating model gives reviewers one place to understand both management capability and field execution.",
        ],
        mediaLabel: "CONSTRUCTION PROJECT MOSAIC",
      },
    ],
    related: constructionRelated,
    sourceUrl: "https://chris16166.wixsite.com/website/portfolio",
  },
  {
    key: "construction/projects/healthcare",
    seoTitle: "Healthcare Construction in Miami | JZ Construction",
    seoDescription:
      "Medical build-outs and clinic renovations coordinated around patients, staff, sensitive equipment and the essential services that continue around the work.",
    division: "construction",
    path: "projects/healthcare",
    category: "sector",
    eyebrow: "JZ Construction / Healthcare",
    title: "Healthcare Construction",
    introduction:
      "Healthcare construction is coordinated around patients, staff, essential services, facility requirements, sensitive equipment, cleanliness, and the operations that continue around the work.",
    mediaLabel: "REPRESENTATIVE COMMERCIAL FRAMING",
    heroMedia: {
      src: "/media/jzg/division-construction.webp",
      alt: "Representative commercial interior framing at the 100 Biscayne project",
      caption: "Representative commercial framing at 100 Biscayne. This image does not document the healthcare projects listed on this page.",
    },
    stats: [
      { value: "Selected", label: "Public healthcare experience" },
      { value: "Occupied", label: "Medical coordination" },
      { value: "Active", label: "Medical environments" },
    ],
    sections: [
      {
        id: "experience",
        eyebrow: "Healthcare experience",
        title: "Active Healthcare",
        paragraphs: [
          "JZ Construction works in sensitive medical environments, including interior floor build-outs and complete clinic renovations. Crews coordinate with the project and facility teams to limit disruption to patients, staff, access, and essential services.",
          "The public portfolio identifies experience associated with Joe DiMaggio Children's Hospital, UHealth, and Memorial Healthcare.",
        ],
        cards: [
          { title: "Joe DiMaggio Children's Hospital" },
          { title: "UHealth" },
          { title: "Memorial Healthcare" },
        ],
        media: {
          src: "/media/jzg/division-construction.webp",
          alt: "Representative commercial interior framing at the 100 Biscayne project",
          caption: "Representative commercial framing at 100 Biscayne. This image does not document the healthcare projects listed on this page.",
        },
      },
    ],
    related: [
      { title: "General contracting", href: "/construction/services/general-contracting" },
      { title: "Subcontracting", href: "/construction/services/subcontracting" },
      { title: "Request healthcare references", href: "/contact?for=construction" },
    ],
    sourceUrl: "https://chris16166.wixsite.com/website/health-care",
  },
  {
    key: "construction/projects/commercial",
    seoTitle: "Commercial Construction in Miami | JZ Construction",
    seoDescription:
      "Retail, entertainment and office construction in active commercial property, coordinated around customers, neighbouring tenants and the finished experience.",
    division: "construction",
    path: "projects/commercial",
    category: "sector",
    eyebrow: "JZ Construction / Commercial",
    title: "Commercial Construction",
    introduction:
      "Retail, entertainment, office, and active commercial projects are coordinated around property operations, customers, neighboring tenants, schedule, safety, and the finished experience.",
    mediaLabel: "COMMERCIAL CONSTRUCTION PROJECT",
    stats: [
      { value: "Selected", label: "Public commercial experience" },
      { value: "Occupied", label: "Property coordination" },
      { value: "Active", label: "Commercial coordination" },
    ],
    sections: [
      {
        id: "experience",
        eyebrow: "Commercial experience",
        title: "High-Traffic Spaces",
        paragraphs: [
          "JZ's commercial construction work includes interior store build-outs, retail and entertainment environments, office support, and active commercial facilities. The team coordinates with owners, property managers, developers, contractors, and surrounding businesses.",
          "Current public project references include Integrated Cooling Solutions in West Palm Beach, the Clerk of County Commissioners ninth-floor vault expansion, and Coral Gables Minorca Garage temporary offices.",
        ],
        cards: [
          { title: "Integrated Cooling Solutions", subtitle: "West Palm Beach" },
          { title: "Clerk of County Commissioners", subtitle: "Ninth-floor vault expansion" },
          { title: "Coral Gables Minorca Garage", subtitle: "Temporary offices" },
        ],
        mediaLabel: "COMMERCIAL CONSTRUCTION GALLERY",
      },
    ],
    related: [
      { title: "Healthcare construction", href: "/construction/projects/healthcare" },
      { title: "General contracting", href: "/construction/services/general-contracting" },
      { title: "Send a commercial scope", href: "/contact?for=construction" },
    ],
    sourceUrl: "https://chris16166.wixsite.com/website/retail",
  },
];

const developmentPages: ContentPageData[] = [
  {
    key: "development/about",
    seoTitle: "About JZ Development | South Florida Developer",
    seoDescription:
      "A Miami-based developer working on residential, mixed-use, workforce-housing and entertainment opportunities across South Florida communities.",
    division: "development",
    path: "about",
    category: "company",
    eyebrow: "JZ Development / About",
    title: "Long-Term Development",
    introduction:
      "JZ Development is a Miami-based development company focused on residential, commercial, mixed-use, workforce-housing, luxury, and entertainment opportunities across South Florida.",
    mediaLabel: "REPRESENTATIVE RESIDENTIAL INTERIOR",
    heroMedia: {
      src: "/media/development/workforce-housing-kitchen.webp",
      alt: "Representative residential kitchen interior",
      caption: "Representative residential interior, not a project-specific portfolio image.",
    },
    stats: [
      { value: "Miami", label: "Home market" },
      { value: "Full lifecycle", label: "Plan through management" },
    ],
    sections: [
      {
        id: "mission",
        eyebrow: "Our mission",
        title: "Places That Last",
        paragraphs: [
          "JZ Development's mission is to deliver high-quality affordable and luxury development across mixed-use, workforce-housing, and entertainment spaces.",
          "The company aims to create communities that are functional, innovative, safe, welcoming, and sustainable while supporting the needs of residents, investors, and the wider community.",
        ],
      },
      {
        id: "experience",
        eyebrow: "Experience",
        title: "The Development Lifecycle",
        paragraphs: [
          "The development process spans land acquisition, project planning, design, construction oversight, partnerships, and property management.",
          "The development approach combines design, project management, strategic planning, and collaboration in pursuit of quality and long-term performance.",
        ],
      },
      {
        id: "values",
        eyebrow: "Values",
        title: "How We Work",
        cards: [
          { title: "Integrity", description: "Transparent, honest communication across partnerships, planning, and project delivery." },
          { title: "Innovation", description: "A continued search for better design, process, service, and project outcomes." },
          { title: "Collaboration", description: "Strong working relationships with clients, partners, consultants, and communities." },
        ],
      },
      {
        id: "team",
        eyebrow: "Office staff",
        title: "Development Leadership",
        cards: [
          { title: "Alexander DeArmas", subtitle: "President" },
          { title: "Zenaida Balseiro", subtitle: "Secretary" },
          { title: "Alberto DeArmas", subtitle: "Head of Development" },
          { title: "Christopher Carter", subtitle: "Vice President" },
        ],
      },
    ],
    related: [
      { title: "View development projects", href: "/development/projects" },
      { title: "Schedule a meeting", href: "/contact?for=development" },
    ],
    sourceUrl: "https://jz-developments.com/about-us",
  },
  {
    key: "development/projects",
    seoTitle: "South Florida Property References | JZ Development",
    seoDescription:
      "Residential property references in Coral Gables and Fort Lauderdale. Contact JZ Development for project-specific role and scope information.",
    division: "development",
    path: "projects",
    category: "projects",
    eyebrow: "JZ Development / Portfolio",
    title: "South Florida Properties",
    introduction:
      "Residential property references in Coral Gables and Fort Lauderdale. Contact JZ Development for project-specific role and scope information.",
    mediaLabel: "REPRESENTATIVE RESIDENTIAL INTERIOR",
    heroMedia: {
      src: "/media/development/workforce-housing-kitchen.webp",
      alt: "Representative residential kitchen interior",
      caption: "Representative residential interior. This image is not identified as any of the properties listed on this page.",
    },
    projectNote: "Property names are provided for reference. A listing does not establish JZ's role as developer, owner, general contractor, or construction manager. Please contact JZ for confirmed role, scope, and project references.",
    sections: [
      {
        id: "portfolio",
        eyebrow: "Residential properties",
        title: "Property References",
        cards: [
          {
            title: "Villa Valencia",
            subtitle: "515 Valencia Avenue / Coral Gables",
            description: "Luxury condominium residences in Coral Gables.",
          },
          {
            title: "AquaVue Las Olas",
            subtitle: "133 Isle of Venice Drive / Fort Lauderdale",
            description: "Condominium residences on Isle of Venice Drive in Fort Lauderdale.",
          },
          {
            title: "AquaMar Las Olas",
            subtitle: "Fort Lauderdale",
            description: "Waterfront condominium residences in Fort Lauderdale.",
          },
          {
            title: "AquaBlu Fort Lauderdale",
            subtitle: "Fort Lauderdale",
            description: "Waterfront condominium residences in Fort Lauderdale.",
          },
          {
            title: "1800 Las Olas",
            subtitle: "East Las Olas Boulevard / Fort Lauderdale",
            description: "Waterfront condominium residences on East Las Olas Boulevard in Fort Lauderdale.",
          },
          {
            title: "AquaLuna Las Olas",
            subtitle: "Fort Lauderdale",
            description: "Waterfront condominium residences in Fort Lauderdale.",
          },
          {
            title: "AquaVita Las Olas",
            subtitle: "Fort Lauderdale",
            description: "Waterfront condominium residences in Fort Lauderdale.",
          },
        ],
      },
      {
        id: "lifecycle",
        eyebrow: "Development platform",
        title: "Full-Lifecycle Development",
        paragraphs: [
          "JZ Development's broader focus includes workforce housing as well as residential, commercial, and mixed-use opportunities. The development process connects land acquisition, project planning, construction oversight, property management, and partnerships.",
        ],
      },
    ],
    related: [
      { title: "About JZ Development", href: "/development/about" },
      { title: "Discuss a partnership", href: "/contact?for=development" },
    ],
    sourceUrl: "https://jz-developments.com/our-projects",
  },
];

export const divisionPageList = [
  ...demolitionPages,
  ...wastePages,
  ...constructionPages,
  ...developmentPages,
];

export const divisionPageMap = new Map(
  divisionPageList.map((page) => [page.key, page]),
);

export function getDivisionPage(division: string, path: string[]) {
  return divisionPageMap.get(`${division}/${path.join("/")}`);
}

export const groupPageList = Object.values(groupPages);

export const publicContentRoutes = [
  ...groupPageList.map((page) => `/${page.path}`),
  ...divisionPageList.map((page) => `/${page.key}`),
];
