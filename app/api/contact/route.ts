import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteUrl } from "@/app/site-url";

export const runtime = "nodejs";
export const maxDuration = 15;

const contacts = {
  demolition: {
    division: "JZ Demolition",
    publicEmail: "estimating@jzdemo.com",
    deliveryEmail: process.env.DEMOLITION_ESTIMATING_EMAIL,
  },
  construction: {
    division: "JZ Construction",
    publicEmail: "estimating@jzconstruction.com",
    deliveryEmail: process.env.CONSTRUCTION_ESTIMATING_EMAIL,
  },
  "waste-management": {
    division: "JZ Waste Management",
    publicEmail: "estimating@jzwastemanagement.com",
    deliveryEmail: process.env.WASTE_ESTIMATING_EMAIL,
  },
  development: {
    division: "JZ Development",
    publicEmail: "estimating@jzdevelopment.com",
    deliveryEmail: process.env.DEVELOPMENT_ESTIMATING_EMAIL,
  },
} as const;

type AllowedExtension = "pdf" | "png" | "jpg" | "jpeg" | "webp";

const fileRules: Record<AllowedExtension, { mimeTypes: ReadonlySet<string> }> = {
  pdf: { mimeTypes: new Set(["application/pdf"]) },
  png: { mimeTypes: new Set(["image/png"]) },
  jpg: { mimeTypes: new Set(["image/jpeg"]) },
  jpeg: { mimeTypes: new Set(["image/jpeg"]) },
  webp: { mimeTypes: new Set(["image/webp"]) },
};

const maxAttachmentCount = 5;
const maxAttachmentBytes = 3 * 1024 * 1024;
const maxRequestBytes = 4 * 1024 * 1024;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaximum = 6;
const requestHistory = new Map<string, number[]>();

const fieldLimits = {
  name: 120,
  company: 180,
  email: 254,
  phone: 40,
  projectType: 160,
  projectLocation: 220,
  facilityStatus: 120,
  timeline: 120,
  planRoomUrl: 2048,
  message: 8000,
} as const;

function json(body: Record<string, unknown>, status = 200, extraHeaders: HeadersInit = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...Object.fromEntries(new Headers(extraHeaders)) },
  });
}

function readText(data: FormData, key: keyof typeof fieldLimits | "division" | "consent" | "companyWebsite") {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validOptionalUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function fieldsFitLimits(values: Record<keyof typeof fieldLimits, string>) {
  return Object.entries(values).every(([key, value]) => value.length <= fieldLimits[key as keyof typeof fieldLimits]);
}

function requestKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "local";
}

function isRateLimited(request: Request) {
  const key = requestKey(request);
  const now = Date.now();
  const recent = (requestHistory.get(key) ?? []).filter((timestamp) => now - timestamp < rateLimitWindowMs);
  if (recent.length >= rateLimitMaximum) {
    requestHistory.set(key, recent);
    return true;
  }
  recent.push(now);
  requestHistory.set(key, recent);
  return false;
}

function isTrustedRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowedOrigins = new Set([new URL(request.url).origin]);
  try {
    allowedOrigins.add(new URL(getSiteUrl()).origin);
  } catch {
    // The request origin remains the safe fallback if a deployment URL is malformed.
  }
  return allowedOrigins.has(origin);
}

function fileExtension(filename: string): AllowedExtension | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension && extension in fileRules ? extension as AllowedExtension : null;
}

function hasExpectedSignature(extension: AllowedExtension, content: Buffer) {
  if (extension === "pdf") return content.subarray(0, 1024).includes(Buffer.from("%PDF-"));
  if (extension === "png") return content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (extension === "jpg" || extension === "jpeg") return content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  return content.subarray(0, 4).toString("ascii") === "RIFF" && content.subarray(8, 12).toString("ascii") === "WEBP";
}

function safeFilename(filename: string, extension: AllowedExtension) {
  const base = filename.slice(0, -(extension.length + 1)).replace(/[^\w\-() ]/g, "_").slice(0, 120) || "attachment";
  return `${base}.${extension}`;
}

export async function POST(request: Request) {
  if (!isTrustedRequest(request)) return json({ ok: false, message: "This submission origin is not allowed." }, 403);
  if (isRateLimited(request)) {
    return json(
      { ok: false, message: "Too many requests were received. Wait a few minutes or email estimating directly." },
      429,
      { "Retry-After": String(Math.ceil(rateLimitWindowMs / 1000)) },
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return json({ ok: false, message: "Use the project form to send this request." }, 415);
  }

  if (Number(request.headers.get("content-length") || 0) > maxRequestBytes) {
    return json({ ok: false, message: "Keep attachments under 3 MB total or include a plan-room link." }, 413);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, message: "We could not read this submission." }, 400);
  }

  if (readText(data, "companyWebsite")) return json({ ok: true, reference: "RECEIVED" });

  const values = {
    name: readText(data, "name"),
    company: readText(data, "company"),
    email: readText(data, "email"),
    phone: readText(data, "phone"),
    projectType: readText(data, "projectType"),
    projectLocation: readText(data, "projectLocation"),
    facilityStatus: readText(data, "facilityStatus"),
    timeline: readText(data, "timeline"),
    planRoomUrl: readText(data, "planRoomUrl"),
    message: readText(data, "message"),
  };
  const division = contacts[readText(data, "division") as keyof typeof contacts];

  if (
    !values.name
    || !values.company
    || !validEmail(values.email)
    || !division
    || !values.projectType
    || !values.projectLocation
    || !values.facilityStatus
    || !values.message
    || !validOptionalUrl(values.planRoomUrl)
    || readText(data, "consent") !== "yes"
    || !fieldsFitLimits(values)
  ) {
    return json({ ok: false, message: "Complete the required fields and try again." }, 400);
  }

  const files = data.getAll("attachments").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (files.length > maxAttachmentCount || totalBytes > maxAttachmentBytes) {
    return json({ ok: false, message: "Attach up to five files under 3 MB total." }, 413);
  }

  const attachments: Array<{ filename: string; content: Buffer }> = [];
  for (const file of files) {
    const extension = fileExtension(file.name);
    if (!extension) {
      return json({ ok: false, message: "Attach PDF, PNG, JPEG, or WebP files. Use a plan-room link for other formats." }, 415);
    }

    const rule = fileRules[extension];
    const suppliedMime = file.type.toLowerCase();
    if (suppliedMime && suppliedMime !== "application/octet-stream" && !rule.mimeTypes.has(suppliedMime)) {
      return json({ ok: false, message: "An attachment type did not match its filename." }, 415);
    }

    const content = Buffer.from(await file.arrayBuffer());
    if (!hasExpectedSignature(extension, content)) {
      return json({ ok: false, message: "An attachment could not be verified as a safe PDF or image." }, 415);
    }

    attachments.push({ filename: safeFilename(file.name, extension), content });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL
    || (process.env.RESEND_EMAIL_DOMAIN ? `JZ Group Website <website@${process.env.RESEND_EMAIL_DOMAIN}>` : "");
  const deliveryEmail = division.deliveryEmail?.trim();
  if (!apiKey || !from || !deliveryEmail) {
    return json({ ok: false, message: `Online routing for ${division.division} is temporarily unavailable. Email ${division.publicEmail} directly.` }, 503);
  }

  const reference = crypto.randomUUID().split("-")[0].toUpperCase();
  const details = [
    ["Reference", reference],
    ["Company", values.company],
    ["Service lane", division.division],
    ["Project type", values.projectType],
    ["Location", values.projectLocation],
    ["Facility status", values.facilityStatus],
    ["Timeline", values.timeline || "Not provided"],
    ["Plan-room link", values.planRoomUrl || "Not provided"],
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone || "Not provided"],
  ];
  const rows = details
    .map(([label, value]) => `<tr><th align="left" style="padding:6px 16px 6px 0;color:#666">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("");
  const subjectCompany = values.company.replace(/[\r\n]+/g, " ");
  const subjectProject = values.projectType.replace(/[\r\n]+/g, " ");
  const resend = new Resend(apiKey);

  try {
    const inquiry = await resend.emails.send({
      from,
      to: [deliveryEmail],
      replyTo: values.email,
      subject: `[${reference}] ${subjectCompany} - ${subjectProject}`,
      html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5"><h1>New JZ Group project inquiry</h1><table>${rows}</table><h2>Project details</h2><p style="white-space:pre-wrap">${escapeHtml(values.message)}</p></div>`,
      attachments,
    });
    if (inquiry.error) throw new Error(inquiry.error.message);
  } catch (error) {
    console.error("Contact inquiry delivery failed", { reference, error });
    return json({ ok: false, message: `We could not send this request. Email ${division.publicEmail} directly.` }, 502);
  }

  try {
    const confirmation = await resend.emails.send({
      from,
      to: [values.email],
      replyTo: deliveryEmail,
      subject: `JZ Group received your request [${reference}]`,
      html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5"><p>Hi ${escapeHtml(values.name)},</p><p>Your request has been routed to <strong>${escapeHtml(division.division)}</strong>.</p><table>${rows}</table><p>A member of the estimating team will follow up after review.</p></div>`,
    });
    if (confirmation.error) console.error("Contact confirmation delivery failed", { reference, error: confirmation.error });
  } catch (error) {
    console.error("Contact confirmation delivery failed", { reference, error });
  }

  return json({ ok: true, reference });
}
