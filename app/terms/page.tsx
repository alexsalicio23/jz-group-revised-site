import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildPageMetadata } from "@/app/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Website Terms | JZ Group",
  description: "Terms governing use of the JZ Group website and its project inquiry tools.",
  path: "/terms",
});

const sections = [
  {
    title: "Acceptance and permitted use",
    paragraphs: [
      <>By using this website, you agree to these terms. You may use the site to learn about JZ Group, evaluate capabilities, review public project information, and submit legitimate business inquiries. Do not interfere with the site, probe for vulnerabilities without written authorization, impersonate another person, or use automated means that disrupt availability.</>,
    ],
  },
  {
    title: "Website information is not a proposal",
    paragraphs: [
      <>Website content is general information and is not a bid, estimate, warranty, professional opinion, qualification package, or promise to perform work. Services, availability, licensing, bonding, insurance, safety records, project references, and specific capabilities must be confirmed in the applicable proposal, contract, or qualification package.</>,
    ],
  },
  {
    title: "Project submissions",
    paragraphs: [
      <>You represent that you are authorized to submit the information and project link you provide. Do not submit patient information, account credentials, financial information, export-controlled material, or another party&apos;s confidential information through the public form. Use an approved access-controlled plan room for confidential project documents and transmit credentials separately.</>,
      <>Submitting a request does not create a contractor-client, fiduciary, partnership, or other contractual relationship. JZ Group may decline or redirect a request.</>,
    ],
  },
  {
    title: "Intellectual property",
    paragraphs: [
      <>The website design, copy, graphics, video, trademarks, and other materials are owned by JZ Group or used with permission. You may view and print reasonable portions for internal project evaluation. Other copying, publication, modification, or commercial reuse requires written permission.</>,
    ],
  },
  {
    title: "Third-party services and links",
    paragraphs: [
      <>Links to plan rooms, maps, social platforms, company websites, and other third-party services are provided for convenience. JZ Group does not control their availability, content, privacy practices, or security. Use those services under their own terms.</>,
    ],
  },
  {
    title: "Availability and disclaimers",
    paragraphs: [
      <>JZ Group works to keep the website accurate, secure, and available, but the site is provided on an as-available basis. To the fullest extent permitted by law, JZ Group disclaims implied warranties relating to the website itself. Nothing here limits obligations expressly accepted in a signed agreement.</>,
    ],
  },
  {
    title: "Limitation of liability",
    paragraphs: [
      <>To the fullest extent permitted by law, JZ Group is not liable for indirect, incidental, special, consequential, or punitive damages arising solely from use of or inability to use this public website. This provision does not exclude liability that cannot legally be limited.</>,
    ],
  },
  {
    title: "Florida law and updates",
    paragraphs: [
      <>These website terms are governed by Florida law, without regard to conflict-of-law principles. JZ Group may revise them when the website or applicable requirements change. Continued use after an update means the revised terms apply to later use.</>,
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      title="Website Terms"
      summary="The practical rules for using JZ Group's public website and project-inquiry tools."
      updated="August 27, 2026"
      sections={sections}
    />
  );
}
