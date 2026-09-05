import Image from "next/image";
import type { ContentPageData, MediaAsset } from "@/app/content-data";
import type { TemplateSlug } from "@/app/templates/template-data";
import { ResponsiveVideo } from "@/components/ResponsiveVideo";

const divisionAssets: Record<TemplateSlug, MediaAsset> = {
  demolition: {
    src: "/media/jzg/mob-pompano-demolition.webp",
    alt: "Controlled demolition underway inside the MOB Pompano project",
    position: "center 45%",
  },
  construction: {
    src: "/media/jzg/division-construction.webp",
    alt: "Commercial interior framing at the 100 Biscayne project",
    position: "center",
  },
  "waste-management": {
    src: "/media/jzg/division-waste.webp",
    alt: "JZ Waste Management truck serving a South Florida jobsite",
    position: "center",
  },
  development: {
    src: "/media/development/workforce-housing-kitchen.webp",
    alt: "Completed interior from a JZ Development property",
    position: "center",
  },
};

const groupAssets: Record<ContentPageData["category"], MediaAsset> = {
  company: {
    src: "/media/jzg/group-field-team.webp",
    alt: "Four JZ Group field team members inside a commercial project",
    position: "center 42%",
  },
  values: {
    src: "/media/jzg/field-bascom-action.webp",
    alt: "JZ field operations during interior construction at Bascom Palmer",
  },
  safety: {
    src: "/media/jzg/safety-containment.webp",
    alt: "Temporary containment protecting an occupied medical-office corridor",
    position: "center",
  },
  service: {
    src: "/media/jzg/mob-pompano-demolition.webp",
    alt: "Controlled demolition underway inside the MOB Pompano project",
    position: "center 45%",
  },
  team: {
    src: "/media/jzg/group-field-team.webp",
    alt: "JZ Group field team inside an active commercial project",
    position: "center 42%",
  },
  projects: {
    src: "/media/jzg/project-100-biscayne.webp",
    alt: "A JZ team member reviewing drawings at 100 Biscayne",
    position: "center 45%",
  },
  sector: {
    src: "/media/jzg/project-bascom-palmer.webp",
    alt: "Interior framing progress at the Bascom Palmer healthcare project",
    position: "center",
  },
  contact: {
    src: "/media/jzg/project-100-biscayne.webp",
    alt: "A JZ team member reviewing project drawings",
    position: "center 45%",
  },
};

const motionAssets: Partial<Record<TemplateSlug, MediaAsset>> = {
  demolition: {
    type: "video",
    src: "/media/video/hero-demolition.mp4",
    poster: "/media/video/hero-demolition-poster.jpg",
    alt: "Specialty demolition operating inside a commercial interior",
  },
  construction: {
    type: "video",
    src: "/media/video/workflow-build.mp4",
    poster: "/media/video/workflow-build-poster.jpg",
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

function selectAsset(
  data: ContentPageData,
  motion: boolean,
  explicitAsset?: MediaAsset,
  context: "hero" | "section" = "hero",
): MediaAsset {
  if (explicitAsset) return explicitAsset;
  if (motion && data.division && motionAssets[data.division]) return motionAssets[data.division]!;
  if (!motion && context === "hero" && data.heroMedia) return data.heroMedia;
  if (data.division) return divisionAssets[data.division];
  return groupAssets[data.category];
}

export function JZMedia({
  data,
  motion = false,
  priority = false,
  className = "",
  asset,
  context = "hero",
}: {
  data: ContentPageData;
  motion?: boolean;
  priority?: boolean;
  className?: string;
  asset?: MediaAsset;
  context?: "hero" | "section";
}) {
  const selectedAsset = selectAsset(data, motion, asset, context);

  if (selectedAsset.type === "video") {
    return (
      <ResponsiveVideo
        className={className}
        src={selectedAsset.src}
        preload={priority ? "auto" : "metadata"}
        poster={selectedAsset.poster}
        ariaLabel={selectedAsset.alt}
      />
    );
  }

  return (
    <Image
      className={className}
      src={selectedAsset.src}
      alt={selectedAsset.alt}
      fill
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      sizes="(max-width: 800px) 100vw, 80vw"
      style={{ objectPosition: selectedAsset.position ?? "center" }}
    />
  );
}
