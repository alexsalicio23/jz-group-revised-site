"use client";

import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";

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

function getInitialDivision(defaultDivision: string) {
  return serviceLanes.some((lane) => lane.value === defaultDivision)
    ? defaultDivision
    : serviceLanes[0].value;
}

function getDivisionFromLocation(defaultDivision: string) {
  const requested = new URLSearchParams(window.location.search).get("for");
  return getInitialDivision(requested ?? defaultDivision);
}

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <span>
      {children}{required ? <><em className="required-mark" aria-hidden="true">*</em><span className="sr-only"> required</span></> : null}
    </span>
  );
}

export function BidForm({ defaultDivision = "demolition" }: { defaultDivision?: string }) {
  const initialDivision = getInitialDivision(defaultDivision);
  // Keep ?for= client-side so /contact remains statically rendered.
  const routeDivision = useSyncExternalStore(
    subscribeToLocation,
    () => getDivisionFromLocation(initialDivision),
    () => initialDivision,
  );
  const [selectedDivisionOverride, setSelectedDivisionOverride] = useState<string | null>(null);
  const selectedDivision = selectedDivisionOverride ?? routeDivision;
  const [status, setStatus] = useState<SubmitState>({ type: "idle" });

  const selectedLane = serviceLanes.find((lane) => lane.value === selectedDivision) ?? serviceLanes[0];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus({ type: "submitting" });

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const result = await response.json() as { ok?: boolean; reference?: string; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "We could not send this request.");
      setStatus({ type: "success", reference: result.reference || "RECEIVED" });
      form.reset();
      setSelectedDivisionOverride(null);
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
    >
      <div className="form-row">
        <label><FieldLabel required>Name</FieldLabel><input name="name" autoComplete="name" required /></label>
        <label><FieldLabel required>Company</FieldLabel><input name="company" autoComplete="organization" required /></label>
      </div>
      <div className="form-row">
        <label><FieldLabel required>Work email</FieldLabel><input name="email" type="email" autoComplete="email" required /></label>
        <label><FieldLabel>Phone</FieldLabel><input name="phone" type="tel" autoComplete="tel" /></label>
      </div>
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
        <label><FieldLabel required>Project type</FieldLabel><input name="projectType" required placeholder="Selective demolition, renovation, hauling..." /></label>
      </div>
      <div className="form-row">
        <label><FieldLabel required>Location</FieldLabel><input name="projectLocation" required placeholder="City or jobsite address" /></label>
        <label><FieldLabel required>Facility status</FieldLabel><select name="facilityStatus" required defaultValue=""><option value="" disabled>Select status</option><option>Active hospital or healthcare facility</option><option>Occupied commercial facility</option><option>Vacant or unoccupied site</option><option>Not sure yet</option></select></label>
      </div>
      <div className="form-row">
        <label><FieldLabel>Timeline</FieldLabel><input name="timeline" placeholder="Bid due date or target start" /></label>
        <label>
          <FieldLabel>Secure plan-room link</FieldLabel>
          <input name="planRoomUrl" type="url" inputMode="url" placeholder="https://..." aria-describedby="plan-room-help" />
          <small id="plan-room-help">Use an access-controlled project link for plans and scope documents. Send credentials separately.</small>
        </label>
      </div>
      <label><FieldLabel required>Project details</FieldLabel><textarea name="message" rows={4} required placeholder="Scope, square footage, access constraints, and anything estimating should know." /></label>
      <label className="form-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>JZ Group may use this information to evaluate and respond to this request as described in the <Link href="/privacy">Privacy Notice</Link>.<em className="required-mark" aria-hidden="true">*</em><span className="sr-only"> required</span></span>
      </label>
      <label className="form-consent form-sensitive-data">
        <input name="dataPolicy" type="checkbox" value="yes" required />
        <span>I will not submit patient or medical information, Social Security numbers, financial account details, passwords, or other sensitive personal data through this form.<em className="required-mark" aria-hidden="true">*</em><span className="sr-only"> required</span></span>
      </label>
      <label className="form-honeypot" aria-hidden="true"><span>Company website</span><input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      <p className="form-routing" aria-live="polite">
        <span>Routing to</span>
        <strong>{selectedLane.label}</strong>
        <a href={`mailto:${selectedLane.email}`}>{selectedLane.email}</a>
      </p>
      <button type="submit" disabled={status.type === "submitting"}>{status.type === "submitting" ? "Sending..." : "Send project details"}</button>
      {status.type === "success" ? (
        <div className="form-confirmation" role="status">
          <span>Request received</span>
          <strong>{status.reference}</strong>
          <p>Your project has been routed to the selected JZ estimating team.</p>
        </div>
      ) : null}
      {status.type === "error" ? <p className="form-status is-error" role="alert">{status.message} <a href={`mailto:${selectedLane.email}`}>Email {selectedLane.label} directly.</a></p> : null}
    </form>
  );
}
