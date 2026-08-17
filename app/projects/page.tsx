import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.projects;

export const metadata: Metadata = buildPageMetadata({
  title: "Projects & Markets | JZ Group",
  description: data.introduction,
  path: "/projects",
  image: "/media/website-photos/construction-framed-interior.webp",
  imageAlt: "Commercial interior build-out in progress",
});

export default function ProjectsPage() {
  return <ContentPage data={data} />;
}
