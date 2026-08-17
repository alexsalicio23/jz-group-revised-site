import type { Metadata } from "next";
import type { TemplateSlug } from "@/app/templates/template-data";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
};

type SocialImage = {
  src: string;
  alt: string;
};

const defaultSocialImage: SocialImage = {
  src: "/media/og-image.jpg",
  alt: "JZ Group field operations in South Florida",
};

export const divisionSocialImages: Record<TemplateSlug, SocialImage> = {
  demolition: {
    src: "/media/website-photos/demolition-active-interior.webp",
    alt: "JZ Demolition crews working inside an active commercial interior",
  },
  construction: {
    src: "/media/website-photos/construction-project-coordination.webp",
    alt: "JZ Construction field leadership coordinating commercial work",
  },
  "waste-management": {
    src: "/media/field-story/waste-truck.webp",
    alt: "JZ Waste Management supporting a South Florida project",
  },
  development: {
    src: "/media/development/workforce-housing-kitchen.webp",
    alt: "Completed interior representing JZ Development work",
  },
};

export function buildPageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage.src,
  imageAlt = defaultSocialImage.alt,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "JZ Group",
      url: path,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
