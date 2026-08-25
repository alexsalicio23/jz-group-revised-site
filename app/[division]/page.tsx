import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DivisionTemplate } from "@/components/DivisionTemplate";
import { DivisionOverview } from "@/components/DivisionOverview";
import { getActiveCompanySite } from "@/app/company-sites";
import { buildPageMetadata, divisionSocialImages } from "@/app/seo";
import { isTemplateSlug, templateOrder, templates } from "@/app/templates/template-data";

type DivisionPageProps = { params: Promise<{ division: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const activeCompany = getActiveCompanySite();
  return (activeCompany ? [activeCompany] : templateOrder).map((division) => ({ division }));
}

export async function generateMetadata({ params }: DivisionPageProps): Promise<Metadata> {
  const { division } = await params;
  if (!isTemplateSlug(division)) return {};
  const data = templates[division];
  const socialImage = divisionSocialImages[division];

  return buildPageMetadata({
    title: data.seoTitle ?? `${data.name} | JZ Group`,
    description: data.seoDescription ?? data.introduction,
    path: getActiveCompanySite() === division ? "/" : `/${division}`,
    image: socialImage.src,
    imageAlt: socialImage.alt,
  });
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { division } = await params;
  if (!isTemplateSlug(division)) notFound();

  const data = templates[division];
  return getActiveCompanySite() === division
    ? <DivisionTemplate data={data} />
    : <DivisionOverview data={data} />;
}
