import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { buildPageMetadata } from "@/app/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Notice | JZ Group",
  description: "How JZ Group collects, uses, shares, protects, and retains information submitted through its website.",
  path: "/privacy",
});

const sections = [
  {
    title: "Scope",
    paragraphs: [
      <>This notice applies to jzgroupmiami.com and the JZ Group company websites that link to it. It describes information handled through the public website and private website-progress portal. It does not replace privacy terms in a signed contract, plan room, or third-party service.</>,
      <>The website is intended for business representatives evaluating or coordinating demolition, construction, waste-management, and development work. It is not directed to children.</>,
    ],
  },
  {
    title: "Information we collect",
    bullets: [
      <>Information you submit: name, company, work email, phone, service lane, project type and location, facility status, timeline, project details, and an optional secure plan-room link.</>,
      <>Operational and security data: IP address, browser and device information, request time, requested page, and server diagnostics processed by Vercel to deliver and protect the website.</>,
      <>Privacy-focused analytics: page path, referrer, coarse location, browser, device type, and performance measurements. Vercel Web Analytics does not use cookies and does not create a persistent cross-site identifier.</>,
      <>Portal data: an essential, encrypted session cookie after an authorized user signs in. The cookie expires after 12 hours and is not used for advertising.</>,
    ],
  },
  {
    title: "How we use information",
    bullets: [
      <>Route a request to the appropriate JZ company and respond to the proposed project.</>,
      <>Evaluate scopes, schedules, locations, facility conditions, and potential business relationships.</>,
      <>Operate, secure, troubleshoot, measure, and improve the website.</>,
      <>Maintain business records and comply with legal, contractual, insurance, and safety obligations.</>,
      <>Investigate abuse, fraud, security incidents, or threats to JZ Group, its customers, or the public.</>,
    ],
  },
  {
    title: "When information is shared",
    paragraphs: [
      <>JZ Group does not sell personal information and does not use website information for targeted advertising. Information is shared only as reasonably necessary with the JZ company responsible for the request, authorized personnel, professional advisers, or service providers operating on JZ Group&apos;s behalf.</>,
    ],
    bullets: [
      <>Vercel hosts, delivers, protects, and measures the website.</>,
      <>Resend transmits project inquiries and transactional confirmations by email.</>,
      <>JZ Group&apos;s email provider receives and stores the delivered inquiry.</>,
      <>Government authorities or other parties may receive information when required by law, needed to protect rights or safety, or connected with a business transaction.</>,
    ],
  },
  {
    title: "Sensitive information and healthcare data",
    paragraphs: [
      <>Do not submit patient names, medical records, diagnoses, insurance information, Social Security numbers, financial account details, passwords, government identification numbers, or other sensitive personal information through the website. JZ Group provides construction-related services in healthcare environments, but this public website is not a HIPAA portal and is not designed to receive protected health information.</>,
      <>Use the owner or general contractor&apos;s approved, access-controlled plan room for confidential project documents and send access credentials through a separate channel.</>,
    ],
  },
  {
    title: "Retention and disposal",
    paragraphs: [
      <>JZ Group retains inquiries only as long as reasonably necessary for bid evaluation, follow-up, recordkeeping, dispute resolution, and legal or contractual obligations. The operating schedule calls for unconverted website inquiries to be reviewed after 12 months of inactivity and deleted when no longer needed. Records connected to an active bid, contract, claim, or legal hold may be retained longer.</>,
      <>The private portal session expires after 12 hours. Vercel and Resend retain service data under their own contracts and policies. JZ Group uses reasonable measures to delete or render unreadable customer records when they are no longer retained.</>,
    ],
  },
  {
    title: "Security",
    paragraphs: [
      <>JZ Group uses HTTPS, restricted administrative access, input validation, request-size limits, origin checks, secure session cookies, security headers, dependency monitoring, and service providers with published security controls. No system can guarantee absolute security, so the site intentionally limits collection and does not accept public file uploads.</>,
      <>If you believe information submitted through this website has been misused or exposed, contact JZ Group immediately using the information below.</>,
    ],
  },
  {
    title: "Your choices and requests",
    paragraphs: [
      <>You may ask JZ Group to confirm, correct, or delete information you submitted through this website. JZ Group may need to verify the request and may retain information where required for a contract, claim, legal obligation, security purpose, or other permitted business need.</>,
      <>The website does not use advertising cookies. The private portal&apos;s essential cookie is required for sign-in and can be removed by signing out or clearing browser storage. See the <Link href="/terms">Website Terms</Link> for conditions governing site use.</>,
    ],
  },
  {
    title: "Changes to this notice",
    paragraphs: [
      <>JZ Group will update this notice when website practices or legal requirements materially change. The revision date at the top identifies the current version, and the notice is reviewed at least annually.</>,
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Notice"
      summary="A plain-language account of the information this website handles and the controls around it."
      updated="August 27, 2026"
      sections={sections}
    />
  );
}
