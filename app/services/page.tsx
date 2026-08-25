import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.services;

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle ?? "Services | JZ Group",
  description: data.seoDescription ?? data.introduction,
  path: "/services",
  image: "/media/website-photos/jz-group-field-operations.webp",
  imageAlt: "JZ Group field operations on a commercial project",
});

export default function ServicesPage() {
  return <ContentPage data={data} />;
}
