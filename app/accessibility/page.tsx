import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildPageMetadata } from "@/app/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Accessibility | JZ Group",
  description: "JZ Group's website accessibility commitment and contact options for assistance or feedback.",
  path: "/accessibility",
});

const sections = [
  {
    title: "Our commitment",
    paragraphs: [
      <>JZ Group is committed to providing a website that is usable by people with disabilities. Accessibility is treated as an ongoing design, development, content, and testing responsibility rather than a one-time certification.</>,
    ],
  },
  {
    title: "Technical target",
    paragraphs: [
      <>The website is designed and maintained with Web Content Accessibility Guidelines (WCAG) 2.2 Level AA as its technical target. The site uses semantic headings, keyboard-operable controls, visible focus states, text alternatives, labeled forms, responsive text, reduced-motion support, and automated accessibility testing.</>,
    ],
  },
  {
    title: "Known limitations",
    paragraphs: [
      <>Some project media, third-party pages, linked plan rooms, social platforms, or documents may be controlled by others or may not yet provide the same level of accessibility. JZ Group will provide information in another reasonable format when possible.</>,
    ],
  },
  {
    title: "Get assistance or report a barrier",
    paragraphs: [
      <>If you have difficulty using any part of the site, include the page address, the problem encountered, the browser or assistive technology used, and the format or assistance you need. JZ Group will review the request and work to provide access through an effective alternative while the issue is addressed.</>,
    ],
  },
] as const;

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      summary="How JZ Group approaches accessible digital communication and how to request assistance."
      updated="August 27, 2026"
      sections={sections}
    />
  );
}
