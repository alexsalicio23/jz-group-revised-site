import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.values;

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle ?? "JZ Group Values | One Operating Standard",
  description: data.seoDescription ?? data.introduction,
  path: "/values",
  image: "/media/website-photos/jz-group-field-operations.webp",
  imageAlt: "JZ Group field professional inside a commercial project",
});

export default function ValuesPage() {
  return <ContentPage data={data} />;
}
