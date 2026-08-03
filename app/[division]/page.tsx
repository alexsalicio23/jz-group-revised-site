import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DivisionTemplate } from "@/components/DivisionTemplate";
import { isTemplateSlug, templateOrder, templates } from "@/app/templates/template-data";

type DivisionPageProps = { params: Promise<{ division: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return templateOrder.map((division) => ({ division }));
}

export async function generateMetadata({ params }: DivisionPageProps): Promise<Metadata> {
  const { division } = await params;
  if (!isTemplateSlug(division)) return {};
  const data = templates[division];

  return {
    title: `${data.name} | JZ Group`,
    description: data.introduction,
    robots: { index: false, follow: false },
  };
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { division } = await params;
  if (!isTemplateSlug(division)) notFound();

  return <DivisionTemplate data={templates[division]} />;
}
