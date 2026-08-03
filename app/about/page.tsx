import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.about;

export const metadata: Metadata = {
  title: "About JZ Group | Four Coordinated Companies",
  description: data.introduction,
};

export default function AboutPage() {
  return <ContentPage data={data} />;
}
