import type { Metadata } from "next";
import Link from "next/link";
import { getActiveCompanySite } from "@/app/company-sites";
import { divisionContacts, divisionLabels } from "@/app/content-data";
import { contact } from "@/app/data";
import { buildPageMetadata } from "@/app/seo";
import { DivisionHeader, GroupHeader } from "@/components/SiteNavigation";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = buildPageMetadata({
  title: "Website Privacy Notice | JZ Group",
  description: "How the JZ company websites handle project and rental inquiries, documents, email delivery, and website usage information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const division = getActiveCompanySite();
  const companyName = division ? divisionLabels[division] : "JZ Group";
  const email = division ? divisionContacts[division].email : contact.email;

  return (
    <main className={`content-page metric-content-page privacy-page content-${division ?? "group"}`}>
      {division ? <DivisionHeader division={division} /> : <GroupHeader />}
      <article className="privacy-content" id="top">
        <header>
          <p>JZ Group / Website Privacy</p>
          <h1>Privacy Notice</h1>
          <p>Updated September 4, 2026</p>
          <p>This notice describes the public websites for JZ Group, JZ Demolition, JZ Construction, JZ Waste Management, and JZ Development, including the shared inquiry form. It does not describe separate employment, contract, or client project-management systems.</p>
        </header>
        <section className="privacy-section" aria-labelledby="privacy-information">
          <h2 id="privacy-information">Information You Provide</h2>
          <p>The group contact form collects your name, email address, selected company or service lane, and project location. A project or bid request also asks for your company, project type, facility status, and project details. A rental inquiry instead asks for material type, requested container, and requested delivery date. Company and facility details are optional for rental inquiries.</p>
          <p>You may also provide a phone number, timeline, requested pickup date, document link, additional details, and up to five PDF or image attachments within the displayed file limits. The consent checkbox is required before the form can submit your request.</p>
          <p>Only share documents you are authorized to provide. Do not send patient information, passwords, financial account details, or other sensitive information through this form. Use an appropriate agreed channel for confidential project records.</p>
        </section>
        <section className="privacy-section" aria-labelledby="privacy-handoff">
          <h2 id="privacy-handoff">Company Contact Pages</h2>
          <p>The individual company contact pages link to the group website instead of collecting your inquiry locally. The handoff link carries only an allowed company or service-lane selection and, for rentals, the rental inquiry type and container selection. Names, email addresses, project addresses, message text, and documents are not carried in that handoff link.</p>
          <p>Enter personal and project information only in the form fields on the group contact page, not in a page URL.</p>
        </section>
        <section className="privacy-section" aria-labelledby="privacy-delivery">
          <h2 id="privacy-delivery">Use and Email Delivery</h2>
          <p>JZ uses the information to review your request, route it to the selected team, and respond. The website checks required fields and attachment format and size, then uses Resend to email the inquiry and any accepted attachments to the configured JZ team mailbox. It also attempts to send a confirmation containing the request summary to your email address.</p>
          <p>Resend and the email providers serving JZ and your inbox process the messages as part of delivery. A document link you submit is included in the email; the contact handler does not download its contents. See <a href="https://resend.com/legal/privacy-policy" rel="noreferrer">Resend&apos;s privacy policy</a> for its service practices.</p>
          <p>The contact handler does not create a separate inquiry database or upload your attachments to a website document library. Delivered messages and attachments can remain in JZ mailboxes and service-provider systems. There is no automatic deletion schedule for those copies implemented by this form; their retention depends on the systems and practices that manage them.</p>
        </section>
        <section className="privacy-section" aria-labelledby="privacy-website">
          <h2 id="privacy-website">Hosting and Usage Data</h2>
          <p>The websites are hosted on Vercel. Hosting and security services process technical request information such as network addresses, requested URLs, browser information, and request times. The contact server uses network-address information and request timestamps in memory to limit repeated submissions. Delivery failures may produce server logs containing a request reference and error information.</p>
          <p>Vercel-hosted versions include Vercel Web Analytics and Speed Insights for page-usage and performance measurements. Vercel describes Web Analytics as using no third-party cookies and no identifiers that track visitors across different websites. These measurements are separate from the information you deliberately submit in an inquiry. See <a href="https://vercel.com/docs/analytics/privacy-policy" rel="noreferrer">Vercel Web Analytics privacy information</a>, <a href="https://vercel.com/docs/speed-insights" rel="noreferrer">Speed Insights documentation</a>, and <a href="https://vercel.com/legal/privacy-notice" rel="noreferrer">Vercel&apos;s privacy notice</a>.</p>
        </section>
        <section className="privacy-section" aria-labelledby="privacy-session">
          <h2 id="privacy-session">Client Access and Links</h2>
          <p>Where client sign-in is available, the server checks the submitted access ID and password. A successful sign-in sets the <code>jz_client_session</code> cookie, containing a signed access-ID session, with a seven-day expiry. Signing out clears that cookie. The sign-in server also uses network-address information to limit failed attempts.</p>
          <p>Links to maps, external documents, other websites, or an email application take you to services governed by their own practices. The website does not control information you provide directly to those services.</p>
        </section>
        <section className="privacy-section" aria-labelledby="privacy-contact">
          <h2 id="privacy-contact">Questions and Requests</h2>
          <p>For questions about an inquiry or to request access, correction, or deletion of information you supplied, contact JZ at <a href={contact.phoneHref}>{contact.phoneDisplay}</a> or <a href={`mailto:${email}`}>{email}</a>. Include the request reference when available, but do not send additional sensitive documents just to identify your request.</p>
          <p>Group office: <a href={contact.mapsHref} rel="noreferrer">{contact.address}</a>.</p>
          <p><Link href={division ? `/contact?for=${division}` : "/contact"}>Contact JZ</Link></p>
        </section>
      </article>
      <SiteFooter companyName={companyName} division={division ?? undefined} email={email} contactHref={division ? `/contact?for=${division}` : "/contact"} subpage />
    </main>
  );
}
