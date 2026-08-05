import Image from "next/image";
import type { ApprovedMedia, ContentPageData } from "@/app/content-data";
import type { TemplateSlug } from "@/app/templates/template-data";

type MediaAsset = {
  src: string;
  alt: string;
  poster?: string;
  type?: "image" | "video";
  position?: string;
};

const divisionAssets: Record<TemplateSlug, MediaAsset> = {
  demolition: {
    src: "/media/field-story/demolition-floor.webp",
    alt: "Selective demolition underway inside a commercial building",
    position: "center 48%",
  },
  construction: {
    src: "/media/field-story/field-control.webp",
    alt: "JZ field crews coordinating commercial interior construction",
    position: "center",
  },
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
  company: {
    src: "/media/field-story/one-group.webp",
    alt: "JZ Group field team member representing the four operating companies",
    position: "center 35%",
  },
  values: {
    src: "/media/field-story/hero-field.webp",
    alt: "JZ crews working together inside a complex commercial interior",
  },
  safety: {
    src: "/media/field-story/safety-detail.webp",
    alt: "JZ safety equipment used during field operations",
    position: "center 30%",
  },
  service: {
    src: "/media/field-story/demolition-floor.webp",
    alt: "JZ specialty work inside a commercial project",
  },
  team: {
    src: "/media/field-story/field-leadership.webp",
    alt: "JZ field leadership reviewing work in progress",
    position: "center 28%",
  },
  projects: {
    src: "/media/field-story/field-control.webp",
    alt: "JZ field operations inside a commercial project",
  },
  sector: {
    src: "/media/field-story/medical-finish.webp",
    alt: "Completed healthcare environment representing JZ project experience",
  },
  contact: {
    src: "/media/field-story/field-leadership.webp",
    alt: "JZ field leader coordinating commercial work",
    position: "center 30%",
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

function selectAsset(data: ContentPageData, motion: boolean, mediaLabel?: string, explicit?: ApprovedMedia): MediaAsset {
  if (explicit?.approved) return explicit;
  const label = (mediaLabel ?? data.mediaLabel).toLowerCase();

  if (motion && data.division && motionAssets[data.division]) return motionAssets[data.division]!;
  if (label.includes("safety") || label.includes("protection")) return groupAssets.safety;
  if (label.includes("founder") || label.includes("leadership") || label.includes("team")) return groupAssets.team;
  if (label.includes("finish") || label.includes("healthcare")) return groupAssets.sector;
  if (label.includes("four companies") || label.includes("one group")) return groupAssets.company;
  if (data.division) return divisionAssets[data.division];
  return groupAssets[data.category];
}

export function JZMedia({
  data,
  motion = false,
  priority = false,
  className = "",
  mediaLabel,
  media,
}: {
  data: ContentPageData;
  motion?: boolean;
  priority?: boolean;
  className?: string;
  mediaLabel?: string;
  media?: ApprovedMedia;
}) {
  const asset = selectAsset(data, motion, mediaLabel, media ?? data.media);

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
