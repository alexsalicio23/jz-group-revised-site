import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.safety;

export const metadata: Metadata = buildPageMetadata({
  title: "Safety & Active Facilities | JZ Group",
  description: data.introduction,
  path: "/safety",
  image: "/media/website-photos/active-facility-containment.webp",
  imageAlt: "Temporary containment protecting an occupied work environment",
});

export default function SafetyPage() {
  return <ContentPage data={data} />;
}
