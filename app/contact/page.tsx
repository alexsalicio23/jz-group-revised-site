import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.contact;

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle ?? "Contact Estimating | JZ Group",
  description: data.seoDescription ?? data.introduction,
  path: "/contact",
  image: "/media/website-photos/construction-plan-review.webp",
  imageAlt: "JZ construction professional reviewing project plans",
});

export default function ContactPage() {
  return <ContentPage data={data} />;
}
