import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresentationInterior } from "@/components/PresentationInterior";
import { presentationDivisions } from "../../presentation-data";

type DivisionPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return presentationDivisions.map((division) => ({ slug: division.slug })); }

export async function generateMetadata({ params }: DivisionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const division = presentationDivisions.find((entry) => entry.slug === slug);
  return division ? { title: `${division.name} | JZ Group` } : {};
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { slug } = await params;
  const division = presentationDivisions.find((entry) => entry.slug === slug);
  if (!division) notFound();
  return (
    <PresentationInterior kicker={`${division.number} / JZ Group division`} title={division.name} introduction={division.statement} mediaLabel={division.mediaLabel}>
      <section className="v3-interior-section">
        <header><p className="v3-label">Capability overview</p><h2>A clear lane inside the group.</h2></header>
        <ol className="v3-capability-list">{division.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability}</h3><p>Detailed scope narrative and approved project photography will be added during content production.</p></li>)}</ol>
      </section>
    </PresentationInterior>
  );
}
