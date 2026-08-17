import Image from "next/image";
import type { ContentPageData } from "@/app/content-data";
import type { TemplateSlug } from "@/app/templates/template-data";

type MediaAsset = {
  src: string;
  alt: string;
  poster?: string;
  type?: "image" | "video";
  position?: string;
};

const suppliedAssets = {
  demolitionActive: {
    src: "/media/website-photos/demolition-active-interior.webp",
    alt: "JZ demolition crews working inside an active commercial interior",
    position: "center 48%",
  },
  demolitionWorker: {
    src: "/media/website-photos/demolition-field-worker.webp",
    alt: "JZ demolition field worker completing selective interior removal",
    position: "center 46%",
  },
  demolitionFloorRemoval: {
    src: "/media/website-photos/demolition-floor-removal.webp",
    alt: "JZ demolition worker operating floor-removal equipment inside an active facility",
    position: "center 52%",
  },
  demolitionTeam: {
    src: "/media/website-photos/demolition-field-team.webp",
    alt: "JZ demolition field team inside an active interior project",
    position: "center 44%",
  },
  airControl: {
    src: "/media/website-photos/active-facility-air-control.webp",
    alt: "HEPA air-control equipment supporting contained interior work",
    position: "center",
  },
  containment: {
    src: "/media/website-photos/active-facility-containment.webp",
    alt: "Temporary containment protecting the occupied areas around an interior work zone",
    position: "center",
  },
  constructionFraming: {
    src: "/media/website-photos/construction-framed-interior.webp",
    alt: "Commercial interior build-out with metal framing in progress",
    position: "center",
  },
  ceilingFraming: {
    src: "/media/website-photos/construction-ceiling-framing.webp",
    alt: "Detailed metal ceiling framing inside a commercial build-out",
    position: "center 42%",
  },
  groupOperations: {
    src: "/media/website-photos/jz-group-field-operations.webp",
    alt: "JZ Group field professional carrying material through a commercial interior",
    position: "center",
  },
  projectCoordination: {
    src: "/media/website-photos/construction-project-coordination.webp",
    alt: "JZ Group field leadership coordinating work with a project partner",
    position: "center 44%",
  },
  planReview: {
    src: "/media/website-photos/construction-plan-review.webp",
    alt: "JZ construction professional reviewing project plans in the field",
    position: "center 44%",
  },
  blueprints: {
    src: "/media/website-photos/construction-blueprints.webp",
    alt: "Construction drawings being reviewed inside an active build-out",
    position: "center",
  },
} satisfies Record<string, MediaAsset>;

const divisionAssets: Record<TemplateSlug, MediaAsset> = {
  demolition: suppliedAssets.demolitionActive,
  construction: suppliedAssets.constructionFraming,
  "waste-management": {
    src: "/media/field-story/waste-truck.webp",
    alt: "JZ Waste Management truck serving a South Florida project",
    position: "center",
  },
  development: {
    src: "/media/development/workforce-housing-kitchen.webp",
    alt: "Completed interior from a JZ Development property",
    position: "center",
  },
};

const groupAssets: Record<ContentPageData["category"], MediaAsset> = {
  company: suppliedAssets.groupOperations,
  values: suppliedAssets.groupOperations,
  safety: suppliedAssets.containment,
  service: suppliedAssets.demolitionFloorRemoval,
  team: {
    src: "/media/field-story/field-leadership.webp",
    alt: "JZ field leadership reviewing work in progress",
    position: "center 28%",
  },
  projects: suppliedAssets.constructionFraming,
  sector: {
    src: "/media/field-story/medical-finish.webp",
    alt: "Completed healthcare environment representing JZ project experience",
  },
  contact: suppliedAssets.planReview,
};

const motionAssets: Partial<Record<TemplateSlug, MediaAsset>> = {
  demolition: {
    type: "video",
    src: "/media/video/hero-demolition.mp4",
    poster: "/media/website-photos/demolition-active-interior.webp",
    alt: "Specialty demolition operating inside a commercial interior",
  },
  construction: {
    type: "video",
    src: "/media/video/workflow-build.mp4",
    poster: "/media/website-photos/construction-framed-interior.webp",
    alt: "Commercial construction progressing through the field",
  },
  "waste-management": {
    type: "video",
    src: "/media/video/workflow-waste.mp4",
    poster: "/media/video/workflow-waste-poster.jpg",
    alt: "JZ Waste Management supporting a South Florida jobsite",
  },
  development: {
    type: "video",
    src: "/media/video/development-interior.mp4",
    poster: "/media/video/development-interior-poster.jpg",
    alt: "Completed interior from a JZ Development property",
  },
};

function labelMatches(label: string, phrases: string[]) {
  return phrases.some((phrase) => label.includes(phrase));
}

function selectAsset(data: ContentPageData, motion: boolean, mediaLabel?: string): MediaAsset {
  const label = (mediaLabel ?? data.mediaLabel).toLowerCase();

  if (motion && data.division && motionAssets[data.division]) return motionAssets[data.division]!;

  if (data.division === "demolition") {
    if (labelMatches(label, ["containment", "site protection", "perimeter control"])) return suppliedAssets.containment;
    if (labelMatches(label, ["active facility control", "safety"])) return suppliedAssets.airControl;
    if (labelMatches(label, ["field team", "demolition team"])) return suppliedAssets.demolitionTeam;
    if (labelMatches(label, ["company photo", "office team"])) return suppliedAssets.demolitionWorker;
    if (labelMatches(label, ["interior demolition", "healthcare"])) return suppliedAssets.demolitionFloorRemoval;
    return suppliedAssets.demolitionActive;
  }

  if (data.division === "construction") {
    if (label.includes("preconstruction team")) return suppliedAssets.planReview;
    if (label.includes("preconstruction / plan review")) return suppliedAssets.blueprints;
    if (labelMatches(label, ["preconstruction", "plan review"])) return suppliedAssets.planReview;
    if (label.includes("blueprint")) return suppliedAssets.blueprints;
    if (labelMatches(label, ["leadership", "project team", "field team", "construction team"])) return suppliedAssets.projectCoordination;
    if (labelMatches(label, ["metal framing", "drywall", "subcontracting"])) return suppliedAssets.ceilingFraming;
    return suppliedAssets.constructionFraming;
  }

  if (label.includes("active facility control")) return suppliedAssets.airControl;
  if (label.includes("safety") || label.includes("protection")) return suppliedAssets.containment;
  if (labelMatches(label, ["estimating", "preconstruction", "plan review"])) return suppliedAssets.planReview;
  if (label.includes("field team")) return suppliedAssets.demolitionTeam;
  if (labelMatches(label, ["four companies", "one group", "jz group team"])) return suppliedAssets.groupOperations;
  if (label.includes("founder") || label.includes("leadership") || label.includes("team")) return groupAssets.team;
  if (label.includes("finish") || label.includes("healthcare")) return groupAssets.sector;
  if (data.division) return divisionAssets[data.division];
  return groupAssets[data.category];
}

export function JZMedia({
  data,
  motion = false,
  priority = false,
  className = "",
  mediaLabel,
}: {
  data: ContentPageData;
  motion?: boolean;
  priority?: boolean;
  className?: string;
  mediaLabel?: string;
}) {
  const asset = selectAsset(data, motion, mediaLabel);

  if (asset.type === "video") {
    return (
      <video
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster={asset.poster}
        aria-label={asset.alt}
      >
        <source src={asset.src} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      className={className}
      src={asset.src}
      alt={asset.alt}
      fill
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      sizes="(max-width: 800px) 100vw, 80vw"
      style={{ objectPosition: asset.position ?? "center" }}
    />
  );
}
