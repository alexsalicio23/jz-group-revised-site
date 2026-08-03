import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PresentationInterior } from "@/components/PresentationInterior";
import { presentationDivisions } from "../presentation-data";

export const metadata: Metadata = { title: "JZ Group Divisions | Four Specialist Companies" };

export default function DivisionsPage() {
  return (
    <PresentationInterior kicker="JZ Group / Four companies" title="Specialists by trade. Accountable as one group." introduction="Each company has a clear operating lane. When the work overlaps, the group coordinates the handoff." mediaLabel="FOUR-COMPANY GROUP PHOTO / 16:9">
      <section className="v3-interior-ledger">
        {presentationDivisions.map((division) => (
          <Link href={`/divisions/${division.slug}`} key={division.slug}><span>{division.number}</span><div><h2>{division.name}</h2><p>{division.statement}</p></div><ArrowUpRight aria-hidden="true" /></Link>
        ))}
      </section>
    </PresentationInterior>
  );
}
