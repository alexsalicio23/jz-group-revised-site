"use client";

import { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

type BidRequestFormProps = {
  destination: string;
};

const fieldValue = (data: FormData, name: string) => String(data.get(name) ?? "").trim();

export function BidRequestForm({ destination }: BidRequestFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const service = fieldValue(data, "service");
    const project = fieldValue(data, "project");

    const body = [
      `Name: ${fieldValue(data, "name")}`,
      `Company: ${fieldValue(data, "company")}`,
      `Email: ${fieldValue(data, "email")}`,
      `Phone: ${fieldValue(data, "phone") || "Not provided"}`,
      "",
      `Service lane: ${service}`,
      `Project type: ${project}`,
      `Location: ${fieldValue(data, "location")}`,
      `Facility status: ${fieldValue(data, "facilityStatus")}`,
      `Bid due / timeline: ${fieldValue(data, "timeline")}`,
      "",
      "Scope details:",
      fieldValue(data, "details"),
    ].join("\n");

    const subject = `Bid request: ${service} / ${project}`;
    window.location.href = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="bid-form" onSubmit={handleSubmit}>
      <div className="bid-form-intro">
        <p>Give estimating the context needed to route the opportunity before the first call.</p>
        <a href={`mailto:${destination}`}>Direct estimating <ArrowUpRight aria-hidden="true" size={17} /></a>
      </div>

      <div className="bid-form-grid">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          <span>Service lane</span>
          <select name="service" defaultValue="" required>
            <option value="" disabled>Select a company or scope</option>
            <option>JZ Demolition</option>
            <option>JZ Waste Management</option>
            <option>JZ Construction</option>
            <option>JZ Development</option>
            <option>Multi-company scope</option>
            <option>Route this for me</option>
          </select>
        </label>
        <label>
          <span>Project type</span>
          <input name="project" placeholder="Healthcare, commercial, education..." required />
        </label>
        <label>
          <span>Project location</span>
          <input name="location" autoComplete="street-address" required />
        </label>
        <label>
          <span>Facility status</span>
          <select name="facilityStatus" defaultValue="" required>
            <option value="" disabled>Select operating condition</option>
            <option>Active / occupied</option>
            <option>Partially occupied</option>
            <option>Vacant</option>
            <option>Not yet confirmed</option>
          </select>
        </label>
        <label>
          <span>Bid due / timeline</span>
          <input name="timeline" placeholder="Date or expected start" required />
        </label>
        <label className="bid-form-details">
          <span>Scope details</span>
          <textarea name="details" rows={5} required />
        </label>
      </div>

      <div className="bid-form-submit">
        <p>Plans, schedules, and supporting documents help estimating evaluate the opportunity.</p>
        <button className="button button-accent" type="submit">
          Prepare bid request <ArrowUpRight aria-hidden="true" size={18} />
        </button>
      </div>
    </form>
  );
}
