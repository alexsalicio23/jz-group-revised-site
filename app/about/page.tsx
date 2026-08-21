import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.about;

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle ?? "About JZ Group | Four Coordinated Companies",
  description: data.seoDescription ?? data.introduction,
  path: "/about",
  image: "/media/website-photos/jz-group-field-operations.webp",
  imageAlt: "JZ Group field professional inside a commercial project",
});

export default function AboutPage() {
  return <ContentPage data={data} />;
}
