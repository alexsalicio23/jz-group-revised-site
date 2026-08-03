import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { divisionPageList, getDivisionPage } from "@/app/content-data";
import { ContentPage } from "@/components/ContentPage";

type ContentRouteProps = {
  params: Promise<{ division: string; path: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return divisionPageList.map((page) => ({
    division: page.division,
    path: page.path.split("/"),
  }));
}

export async function generateMetadata({ params }: ContentRouteProps): Promise<Metadata> {
  const { division, path } = await params;
  const data = getDivisionPage(division, path);
  if (!data) return {};

  return {
    title: `${data.title} | ${data.eyebrow.split(" / ")[0]}`,
    description: data.introduction,
    openGraph: {
      title: data.title,
      description: data.introduction,
      images: [{ url: "/media/og-image.jpg", width: 1200, height: 630, alt: "JZ Group field operations" }],
    },
  };
}

export default async function DivisionContentPage({ params }: ContentRouteProps) {
  const { division, path } = await params;
  const data = getDivisionPage(division, path);
  if (!data) notFound();

  return <ContentPage data={data} />;
}
