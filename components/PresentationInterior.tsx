import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MediaPlaceholder } from "./MediaPlaceholder";

type PresentationInteriorProps = {
  kicker: string;
  title: string;
  introduction: string;
  mediaLabel: string;
  children: React.ReactNode;
};

export function PresentationInterior({ kicker, title, introduction, mediaLabel, children }: PresentationInteriorProps) {
  return (
    <main className="v3-interior">
      <header className="v3-interior-header">
        <Link href="/" aria-label="Return to JZ Group home"><Image src="/media/brand-logo.webp" alt="JZ Group" width={132} height={66} priority sizes="112px" /></Link>
        <nav aria-label="Interior navigation"><Link href="/divisions">Divisions</Link><Link href="/projects">Projects</Link><Link href="/#contact">Contact</Link></nav>
      </header>
      <section className="v3-interior-hero">
        <div><p className="v3-label v3-label-light">{kicker}</p><h1>{title}</h1><p>{introduction}</p><Link href="/#contact">Send a scope <ArrowUpRight aria-hidden="true" size={18} /></Link></div>
        <MediaPlaceholder label={mediaLabel} />
      </section>
      {children}
      <footer className="v3-interior-footer"><Link href="/"><ArrowLeft aria-hidden="true" size={18} /> Return to JZ Group</Link><span>Miami-Dade / Broward / Palm Beach</span></footer>
    </main>
  );
}
