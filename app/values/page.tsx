import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.values;

export const metadata: Metadata = {
  title: "JZ Group Values | One Operating Standard",
  description: data.introduction,
};

export default function ValuesPage() {
  return <ContentPage data={data} />;
}
