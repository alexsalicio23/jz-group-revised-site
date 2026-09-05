"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { groupContactHref } from "@/app/company-sites";
import { divisionLabels } from "@/app/content-data";
import { rentalContainerOptions } from "@/app/contact/contact-intent";
import { useContactIntent } from "@/app/contact/use-contact-intent";
import type { TemplateSlug } from "@/app/templates/template-data";

export function ContactHandoff({ division }: { division: TemplateSlug }) {
  const intent = useContactIntent(division);
  const container = rentalContainerOptions.find((option) => option.value === intent.container);

  return (
    <div className="contact-handoff" data-contact-handoff>
      <h2>{intent.inquiry === "rental" ? "Request a Dumpster" : "Contact Estimating"}</h2>
      <p>Continue to JZ Group to send your {intent.inquiry === "rental" ? "rental request" : "project details"} to {divisionLabels[intent.division]}.</p>
      {container ? <p className="contact-handoff-selection"><strong>Requested container:</strong> {container.label}</p> : null}
      <a className="metric-button contact-handoff-link" href={groupContactHref(intent)} referrerPolicy="no-referrer">
        Continue to JZ Group <ArrowUpRight aria-hidden="true" size={18} />
      </a>
      <p>Your contact details and documents are entered on the group website, not on this company page.</p>
      <Link href="/privacy">Privacy Notice</Link>
    </div>
  );
}
