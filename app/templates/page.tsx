import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { templateOrder, templates } from "./template-data";

export const metadata: Metadata = {
  title: "JZ Company Website Templates | Client Review",
  description: "Four proposed homepage directions for the JZ family of companies.",
  robots: { index: false, follow: false },
};

const previews = {
  demolition: "/media/video/hero-demolition-poster.jpg",
  "waste-management": "/media/video/workflow-waste-poster.jpg",
  construction: "/media/video/workflow-build-poster.jpg",
  development: "/media/development/workforce-housing-kitchen.webp",
};

const concepts = {
  demolition: "Cinematic prequalification",
  "waste-management": "Dispatch operations",
  construction: "Field journal",
  development: "Investment editorial",
} as const;

export default function TemplatesPage() {
  return (
    <main className="template-review" id="top">
      <header className="review-header">
        <Link href="/" aria-label="JZ Group flagship homepage">
          <Image src="/media/brand-logo.webp" alt="JZ Group" width={108} height={72} priority />
        </Link>
        <p>Private client review / Homepage directions</p>
        <Link href="/">View flagship</Link>
      </header>

      <section className="review-intro">
        <h1>Four companies four distinct reasons to believe</h1>
        <p>
          These are homepage templates for visual and strategic approval. They share one JZ standard,
          but each site leads with the audience, work, and proof that matter to that company.
        </p>
      </section>

      <section className="review-grid" aria-label="Division website templates">
        {templateOrder.map((slug) => {
          const item = templates[slug];
          return (
            <Link className={`review-tile review-${slug}`} href={`/templates/${slug}`} key={slug}>
              <Image src={previews[slug]} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" />
              <span className="review-tile-shade" />
              <span className="review-tile-index">{item.index}</span>
              <span className="review-tile-copy">
                <small>{concepts[slug]}</small>
                <strong>{item.name}</strong>
                <em>{item.headline}</em>
              </span>
              <span className="review-tile-link">Open template <ArrowUpRight aria-hidden="true" size={18} /></span>
            </Link>
          );
        })}
      </section>

      <footer className="review-footer">
        <p>Draft review only. Public claims, project media, and final content remain subject to JZ approval.</p>
        <span>JZ Group / South Florida</span>
      </footer>
    </main>
  );
}
