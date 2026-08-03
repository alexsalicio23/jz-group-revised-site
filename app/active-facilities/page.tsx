import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PresentationInterior } from "@/components/PresentationInterior";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { activeMethods } from "../presentation-data";

export const metadata: Metadata = { title: "Active Hospitals & Occupied Facilities | JZ Group" };

export default function ActiveFacilitiesPage() {
  return (
    <PresentationInterior kicker="Specialty demolition / Active facilities" title="Work planned around what cannot stop." introduction="A focused view of how JZ approaches demolition and related work inside active hospitals, occupied facilities, and operational commercial environments." mediaLabel="ACTIVE HOSPITAL WORK / 16:9">
      <section className="v3-interior-section">
        <header><p className="v3-label">The operating method</p><h2>Plan. Protect. Execute. Turn over.</h2></header>
        <div className="v3-method-records">{activeMethods.map((method) => <article key={method.title}><MediaPlaceholder label={method.mediaLabel} /><div><span>{method.number}</span><h3>{method.title}</h3><p>{method.description}</p></div></article>)}</div>
        <Link className="v3-interior-cta" href="/safety">Review safety priorities <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </section>
    </PresentationInterior>
  );
}
