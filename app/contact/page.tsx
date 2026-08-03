import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.contact;

export const metadata: Metadata = {
  title: "Contact Estimating | JZ Group",
  description: data.introduction,
};

export default function ContactPage() {
  return <ContentPage data={data} />;
}
