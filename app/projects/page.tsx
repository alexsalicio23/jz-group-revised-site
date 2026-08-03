import type { Metadata } from "next";
import { PresentationInterior } from "@/components/PresentationInterior";
import { ProjectGallery } from "@/components/ProjectGallery";
import { presentationProjects } from "../presentation-data";

export const metadata: Metadata = { title: "Selected Projects | JZ Group" };

export default function ProjectsPage() {
  return (
    <PresentationInterior kicker="Selected work / Project index" title="Work a reviewer can inspect." introduction="Open each record for the setting, scope, and result. Approved photography will replace every labeled media slot." mediaLabel="PROJECT GALLERY COVER / 16:9">
      <section className="v3-interior-projects"><ProjectGallery projects={presentationProjects} /></section>
    </PresentationInterior>
  );
}
