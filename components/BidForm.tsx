"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { type: "idle" | "submitting" }
  | { type: "success"; reference: string }
  | { type: "error"; message: string };

const serviceLanes = [
  ["demolition", "JZ Demolition"],
  ["construction", "JZ Construction"],
  ["waste-management", "JZ Waste Management"],
  ["development", "JZ Development"],
] as const;

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <span>
      {children}{required ? <><em className="required-mark" aria-hidden="true">*</em><span className="sr-only"> required</span></> : null}
    </span>
  );
}

export function BidForm({ defaultDivision = "demolition" }: { defaultDivision?: string }) {
  const [status, setStatus] = useState<SubmitState>({ type: "idle" });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ type: "submitting" });

    try {
      const response = await fetch("/api/contact", { method: "POST", body: new FormData(form) });
      const result = await response.json() as { ok?: boolean; reference?: string; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "We could not send this request.");
      setStatus({ type: "success", reference: result.reference || "RECEIVED" });
      form.reset();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "We could not send this request." });
    }
  };

  return (
    <form className="bid-form" onSubmit={submit} aria-busy={status.type === "submitting"}>
      <div className="form-row">
        <label><FieldLabel required>Name</FieldLabel><input name="name" autoComplete="name" required /></label>
        <label><FieldLabel required>Work email</FieldLabel><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className="form-row">
        <label><FieldLabel>Phone</FieldLabel><input name="phone" type="tel" autoComplete="tel" /></label>
        <label><FieldLabel required>Service lane</FieldLabel><select name="division" required defaultValue={defaultDivision}>{serviceLanes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      </div>
      <div className="form-row">
        <label><FieldLabel required>Project type</FieldLabel><input name="projectType" required placeholder="Selective demolition, renovation, hauling..." /></label>
        <label><FieldLabel required>Location</FieldLabel><input name="projectLocation" required placeholder="City or jobsite address" /></label>
      </div>
      <div className="form-row">
        <label><FieldLabel required>Facility status</FieldLabel><select name="facilityStatus" required defaultValue=""><option value="" disabled>Select status</option><option>Active hospital or healthcare facility</option><option>Occupied commercial facility</option><option>Vacant or unoccupied site</option><option>Not sure yet</option></select></label>
        <label><FieldLabel>Timeline</FieldLabel><input name="timeline" placeholder="Bid due date or target start" /></label>
      </div>
      <label><FieldLabel required>Project details</FieldLabel><textarea name="message" rows={4} required placeholder="Scope, square footage, access constraints, and anything estimating should know." /></label>
      <label className="file-field"><FieldLabel>Plans or scope</FieldLabel><input name="attachments" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.zip" /><small>Up to five files and 3 MB total. Include a plan-room link above for larger sets.</small></label>
      <label className="form-consent"><input name="consent" type="checkbox" value="yes" required /><span>JZ Group may use this information to evaluate and respond to this request.</span></label>
      <label className="form-honeypot" aria-hidden="true"><span>Company website</span><input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      <button type="submit" disabled={status.type === "submitting"}>{status.type === "submitting" ? "Sending..." : "Send project details"}</button>
      {status.type === "success" ? <p className="form-status" role="status">Request received. Reference <strong>{status.reference}</strong>.</p> : null}
      {status.type === "error" ? <p className="form-status is-error" role="alert">{status.message} <a href="mailto:estimating@jzdemo.com">Email estimating directly.</a></p> : null}
    </form>
  );
}
