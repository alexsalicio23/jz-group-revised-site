import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.projects;

export const metadata: Metadata = {
  title: "Projects & Markets | JZ Group",
  description: data.introduction,
};

export default function ProjectsPage() {
  return <ContentPage data={data} />;
}
