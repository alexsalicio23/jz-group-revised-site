"use client";

import { FormEvent, useState } from "react";
import { directContacts } from "@/app/presentation-data";

type SubmitState = { type: "idle" | "submitting" } | { type: "success"; reference: string } | { type: "error"; message: string };

export function BidForm() {
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
    <form className="v3-bid-form" onSubmit={submit} aria-busy={status.type === "submitting"}>
      <div className="v3-form-row">
        <label><span>Name</span><input name="name" autoComplete="name" required /></label>
        <label><span>Work email</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className="v3-form-row">
        <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
        <label><span>Service lane</span><select name="division" required defaultValue="demolition">{directContacts.map((entry) => <option value={entry.slug} key={entry.slug}>{entry.division}</option>)}</select></label>
      </div>
      <div className="v3-form-row">
        <label><span>Project type</span><input name="projectType" required placeholder="Selective demolition, renovation, hauling..." /></label>
        <label><span>Location</span><input name="projectLocation" required placeholder="City or jobsite address" /></label>
      </div>
      <div className="v3-form-row">
        <label><span>Facility status</span><select name="facilityStatus" required defaultValue=""><option value="" disabled>Select status</option><option>Active hospital or healthcare facility</option><option>Occupied commercial facility</option><option>Vacant or unoccupied site</option><option>Not sure yet</option></select></label>
        <label><span>Timeline</span><input name="timeline" placeholder="Bid due date or target start" /></label>
      </div>
      <label><span>Project details</span><textarea name="message" rows={4} required placeholder="Scope, square footage, access constraints, and anything estimating should know." /></label>
      <label className="v3-file-field"><span>Plans or scope</span><input name="attachments" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.zip" /><small>Up to five files and 3 MB total. Include a plan-room link above for larger sets.</small></label>
      <label className="v3-consent"><input name="consent" type="checkbox" value="yes" required /><span>JZ Group may use this information to evaluate and respond to this request.</span></label>
      <label className="v3-honeypot" aria-hidden="true"><span>Company website</span><input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      <button type="submit" disabled={status.type === "submitting"}>{status.type === "submitting" ? "Sending..." : "Send project details"}</button>
      {status.type === "success" ? <p className="v3-form-status" role="status">Request received. Reference <strong>{status.reference}</strong>.</p> : null}
      {status.type === "error" ? <p className="v3-form-status is-error" role="alert">{status.message} Email estimating directly if the issue continues.</p> : null}
    </form>
  );
}
