import type { Metadata } from "next";
import { groupPages } from "@/app/content-data";
import { divisionLabels } from "@/app/content-data";
import { getActiveCompanySite } from "@/app/company-sites";
import { buildPageMetadata } from "@/app/seo";
import { ContentPage } from "@/components/ContentPage";

const data = groupPages.contact;
const activeCompany = getActiveCompanySite();
const pageData = activeCompany
  ? {
      ...data,
      division: activeCompany,
      eyebrow: `${divisionLabels[activeCompany]} / Contact`,
      title: `Contact ${divisionLabels[activeCompany]}`,
      introduction: `Send project information to the ${divisionLabels[activeCompany]} estimating team. Include the location, schedule, facility status, bid date, and available scope documents.`,
    }
  : data;

export const metadata: Metadata = buildPageMetadata({
  title: activeCompany ? `Contact ${divisionLabels[activeCompany]} Estimating` : data.seoTitle ?? "Contact Estimating | JZ Group",
  description: pageData.introduction,
  path: "/contact",
  image: "/media/website-photos/construction-plan-review.webp",
  imageAlt: "JZ construction professional reviewing project plans",
});

export default function ContactPage() {
  return <ContentPage data={pageData} />;
}
