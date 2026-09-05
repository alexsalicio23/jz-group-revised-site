"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { isRentalContainerToken, rentalContainerOptions } from "@/app/contact/contact-intent";
import { useContactIntent } from "@/app/contact/use-contact-intent";

type SubmitState =
  | { type: "idle" | "submitting" }
  | { type: "success"; reference: string }
  | { type: "error"; message: string };

const serviceLanes = [
  { value: "demolition", label: "JZ Demolition", email: "estimating@jzdemo.com" },
  { value: "construction", label: "JZ Construction", email: "estimating@jzconstruction.com" },
  { value: "waste-management", label: "JZ Waste Management", email: "estimating@jzwastemanagement.com" },
  { value: "development", label: "JZ Development", email: "estimating@jzdevelopment.com" },
] as const;

const maxAttachmentCount = 5;
const maxAttachmentBytes = 3 * 1024 * 1024;

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <span>
      {children}{required ? <><em className="required-mark" aria-hidden="true">*</em><span className="sr-only"> required</span></> : null}
    </span>
  );
}

function FacilityField({ required = false }: { required?: boolean }) {
  return <label><FieldLabel required={required}>Facility status</FieldLabel><select name="facilityStatus" required={required} defaultValue=""><option value="" disabled={required}>{required ? "Select status" : "Not provided"}</option><option>Active hospital or healthcare facility</option><option>Occupied commercial facility</option><option>Vacant or unoccupied site</option><option>Not sure yet</option></select></label>;
}

function AttachmentField() {
  return (
    <label className="file-field">
      <FieldLabel>Small plan or scope excerpts</FieldLabel>
      <input name="attachments" type="file" multiple accept="application/pdf,image/png,image/jpeg,image/webp" aria-describedby="attachment-help" />
      <small id="attachment-help">Optional: attach up to five PDF or image excerpts under 3 MB total. Share full plan sets, CAD, Office, ZIP, or larger files with the plan-room link above.</small>
    </label>
  );
}

export function BidForm({ defaultDivision = "demolition" }: { defaultDivision?: string }) {
  const intent = useContactIntent(defaultDivision);
  const [selectedDivisionOverride, setSelectedDivisionOverride] = useState<string | null>(null);
  const [inquiryOverride, setInquiryOverride] = useState<"bid" | "rental" | null>(null);
  const [containerOverride, setContainerOverride] = useState<string | null>(null);
  const selectedDivision = selectedDivisionOverride ?? intent.division;
  const isRental = selectedDivision === "waste-management" && (inquiryOverride ?? intent.inquiry) === "rental";
  const selectedContainer = containerOverride ?? intent.container ?? "";
  const [status, setStatus] = useState<SubmitState>({ type: "idle" });

  const selectedLane = serviceLanes.find((lane) => lane.value === selectedDivision) ?? serviceLanes[0];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData
      .getAll("attachments")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const totalAttachmentBytes = files.reduce((total, file) => total + file.size, 0);

    if (files.length > maxAttachmentCount || totalAttachmentBytes > maxAttachmentBytes) {
      setStatus({
        type: "error",
        message: "Attach up to five files under 3 MB total, or add a plan-room link.",
      });
      return;
    }

    setStatus({ type: "submitting" });

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const result = await response.json() as { ok?: boolean; reference?: string; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "We could not send this request.");
      setStatus({ type: "success", reference: result.reference || "RECEIVED" });
      form.reset();
      setSelectedDivisionOverride(null);
      setInquiryOverride(null);
      setContainerOverride(null);
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "We could not send this request." });
    }
  };

  return (
    <form
      action="/api/contact"
      className="bid-form"
      encType="multipart/form-data"
      method="post"
      onSubmit={submit}
      aria-busy={status.type === "submitting"}
      data-inquiry={isRental ? "rental" : "bid"}
    >
      {isRental ? <h3 className="rental-form-title">Dumpster Rental Inquiry</h3> : null}
      <div className="form-row">
        <label><FieldLabel required>Name</FieldLabel><input name="name" autoComplete="name" maxLength={120} required /></label>
        <label><FieldLabel required>{isRental ? "Email" : "Work email"}</FieldLabel><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      </div>
      {!isRental ? <div className="form-row">
        <label><FieldLabel required>Company</FieldLabel><input name="company" autoComplete="organization" maxLength={180} required /></label>
        <label><FieldLabel>Phone</FieldLabel><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      </div> : null}
      <div className="form-row">
        <label>
          <FieldLabel required>Service lane</FieldLabel>
          <select
            name="division"
            required
            value={selectedDivision}
            onChange={(event) => setSelectedDivisionOverride(event.target.value)}
          >
            {serviceLanes.map((lane) => <option value={lane.value} key={lane.value}>{lane.label}</option>)}
          </select>
        </label>
        {selectedDivision === "waste-management" ? (
          <label><FieldLabel>Inquiry type</FieldLabel><select name="inquiry" value={isRental ? "rental" : "bid"} onChange={(event) => setInquiryOverride(event.target.value === "rental" ? "rental" : "bid")}><option value="bid">Project or bid request</option><option value="rental">Dumpster rental</option></select></label>
        ) : <label><FieldLabel required>Project type</FieldLabel><input name="projectType" maxLength={160} required placeholder="Selective demolition, renovation, hauling..." /></label>}
      </div>
      {selectedDivision === "waste-management" && !isRental ? <label><FieldLabel required>Project type</FieldLabel><input name="projectType" maxLength={160} required placeholder="Hauling, recycling, site cleanup..." /></label> : null}
      <div className="form-row">
        <label><FieldLabel required>Location</FieldLabel><input name="projectLocation" maxLength={220} required placeholder="City or jobsite address" /></label>
        {isRental ? <label><FieldLabel required>Material type</FieldLabel><input name="materialType" required maxLength={160} placeholder="Concrete, construction debris, household items..." /></label> : <FacilityField required />}
      </div>
      {isRental ? <>
        <div className="form-row">
          <label><FieldLabel required>Requested container</FieldLabel><select name="container" required value={selectedContainer} onChange={(event) => setContainerOverride(isRentalContainerToken(event.target.value) ? event.target.value : "")}><option value="" disabled>Select container</option>{rentalContainerOptions.map((container) => <option key={container.value} value={container.value}>{container.label}</option>)}</select></label>
          <label><FieldLabel required>Requested delivery date</FieldLabel><input name="deliveryDate" type="date" required /></label>
        </div>
        <details className="rental-optional-fields">
          <summary>Additional details and documents (optional)</summary>
          <div className="rental-optional-fields-body">
            <div className="form-row">
              <label><FieldLabel>Company</FieldLabel><input name="company" autoComplete="organization" maxLength={180} /></label>
              <label><FieldLabel>Phone</FieldLabel><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
            </div>
            <div className="form-row"><FacilityField /><label><FieldLabel>Requested pickup date</FieldLabel><input name="pickupDate" type="date" /></label></div>
            <label><FieldLabel>Rental details</FieldLabel><textarea name="message" rows={3} maxLength={8000} placeholder="Placement, access, pickup timing, or other details." /></label>
            <label><FieldLabel>Plan-room or document link</FieldLabel><input name="planRoomUrl" type="url" inputMode="url" maxLength={2048} placeholder="https://..." /></label>
            <AttachmentField />
          </div>
        </details>
        <p className="rental-availability-note">Dates and container availability are subject to confirmation by JZ Waste Management. This inquiry is not a booking.</p>
      </> : <>
        <div className="form-row">
          <label><FieldLabel>Timeline</FieldLabel><input name="timeline" maxLength={120} placeholder="Bid due date or target start" /></label>
          <label><FieldLabel>Plan-room or document link</FieldLabel><input name="planRoomUrl" type="url" inputMode="url" maxLength={2048} placeholder="https://..." /></label>
        </div>
        <label><FieldLabel required>Project details</FieldLabel><textarea name="message" rows={4} maxLength={8000} required placeholder="Scope, square footage, access constraints, and anything estimating should know." /></label>
        <AttachmentField />
      </>}
      <label className="form-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>JZ Group may use this information to evaluate and respond to this request.<em className="required-mark" aria-hidden="true">*</em><span className="sr-only"> required</span></span>
      </label>
      <p className="form-privacy">Read our <Link href="/privacy">Privacy Notice</Link>. Do not include patient information, passwords, financial account details, or documents you are not authorized to share.</p>
      <label className="form-honeypot" aria-hidden="true"><span>Company website</span><input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      <p className="form-routing" aria-live="polite">
        <span>Routing to</span>
        <strong>{selectedLane.label}</strong>
        <a href={`mailto:${selectedLane.email}`}>{selectedLane.email}</a>
      </p>
      <button type="submit" disabled={status.type === "submitting"}>{status.type === "submitting" ? "Sending..." : isRental ? "Send rental inquiry" : "Send project details"}</button>
      {status.type === "success" ? (
        <div className="form-confirmation" role="status">
          <span>Request received</span>
          <strong>{status.reference}</strong>
          <p>Your inquiry has been routed to the selected JZ team. Requested dates and services are subject to confirmation.</p>
        </div>
      ) : null}
      {status.type === "error" ? <p className="form-status is-error" role="alert">{status.message} <a href={`mailto:${selectedLane.email}`}>Email {selectedLane.label} directly.</a></p> : null}
    </form>
  );
}
