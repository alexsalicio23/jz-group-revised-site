import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { divisionPageList, getDivisionPage } from "@/app/content-data";
import { companySiteHref, getActiveCompanySite } from "@/app/company-sites";
import { buildPageMetadata, divisionSocialImages } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

type ContentRouteProps = {
  params: Promise<{ division: string; path: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const activeCompany = getActiveCompanySite();
  return divisionPageList.filter((page) => !activeCompany || page.division === activeCompany).map((page) => ({
    division: page.division,
    path: page.path.split("/"),
  }));
}

export async function generateMetadata({ params }: ContentRouteProps): Promise<Metadata> {
  const { division, path } = await params;
  const data = getDivisionPage(division, path);
  if (!data) return {};
  const socialImage = data.division ? divisionSocialImages[data.division] : undefined;

  return buildPageMetadata({
    title: data.seoTitle ?? `${data.title} | ${data.eyebrow.split(" / ")[0]}`,
    description: data.seoDescription ?? data.introduction,
    path: getActiveCompanySite() === division ? `/${path.join("/")}` : `/${division}/${path.join("/")}`,
    image: socialImage?.src,
    imageAlt: socialImage?.alt,
  });
}

export default async function DivisionContentPage({ params }: ContentRouteProps) {
  const { division, path } = await params;
  const data = getDivisionPage(division, path);
  if (!data) notFound();

  if (getActiveCompanySite() !== division) {
    redirect(companySiteHref(division as Parameters<typeof companySiteHref>[0], path.join("/")));
  }

  return <ContentPage data={data} />;
}
