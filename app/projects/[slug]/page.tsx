import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { PresentationInterior } from "@/components/PresentationInterior";
import { presentationProjects } from "../../presentation-data";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return presentationProjects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = presentationProjects.find((entry) => entry.slug === slug);
  return project ? { title: `${project.title} | JZ Group Project` } : {};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = presentationProjects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return (
    <PresentationInterior kicker={`${project.market} / ${project.location}`} title={project.title} introduction={project.summary} mediaLabel={project.mediaLabel}>
      <section className="v3-case-study">
        <dl>{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="v3-case-study-grid"><MediaPlaceholder label="EXISTING CONDITIONS / PROJECT PHOTO" /><MediaPlaceholder label="FIELD EXECUTION / PROJECT PHOTO" /><MediaPlaceholder label="TURNOVER / COMPLETED PROJECT" /></div>
        <div className="v3-case-study-copy"><article><p className="v3-label">Scope</p><h2>{project.scope}</h2></article><article><p className="v3-label">Project narrative</p><p>Approved project narrative, controls, outcomes, and client references will be inserted here after JZ content verification.</p></article></div>
      </section>
    </PresentationInterior>
  );
}
