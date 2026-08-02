import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DivisionTemplate } from "@/components/DivisionTemplate";
import { isTemplateSlug, templateOrder, templates } from "../template-data";

type TemplatePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return templateOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isTemplateSlug(slug)) return {};
  const data = templates[slug];

  return {
    title: `${data.name} Website Template | Client Review`,
    description: data.introduction,
    robots: { index: false, follow: false },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  if (!isTemplateSlug(slug)) notFound();

  return <DivisionTemplate data={templates[slug]} />;
}
