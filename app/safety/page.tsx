import type { Metadata } from "next";
import { PresentationInterior } from "@/components/PresentationInterior";
import { qualificationTopics } from "../presentation-data";

export const metadata: Metadata = { title: "Safety & Qualifications | JZ Group" };

export default function SafetyPage() {
  return (
    <PresentationInterior kicker="Safety / Qualifications" title="Safety is part of the deliverable." introduction="The presentation version keeps qualification language general until JZ confirms specific programs, metrics, credentials, and supporting documents." mediaLabel="SAFETY + PROTECTION SETUP / 16:9">
      <section className="v3-interior-section">
        <header><p className="v3-label">Qualification priorities</p><h2>Visible controls. Verifiable documentation.</h2></header>
        <ol className="v3-capability-list">{qualificationTopics.map((topic, index) => <li key={topic}><span>{String(index + 1).padStart(2, "0")}</span><h3>{topic}</h3><p>Approved documentation, metrics, and supporting detail will be connected here after client verification.</p></li>)}</ol>
      </section>
    </PresentationInterior>
  );
}
