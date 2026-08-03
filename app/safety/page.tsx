import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.safety;

export const metadata: Metadata = {
  title: "Safety & Active Facilities | JZ Group",
  description: data.introduction,
};

export default function SafetyPage() {
  return <ContentPage data={data} />;
}
