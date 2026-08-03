import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const maxDuration = 15;

const contacts = {
  demolition: { division: "JZ Demolition", email: "estimating@jzdemo.com" },
  construction: { division: "JZ Construction", email: "estimating@jzconstruction.com" },
  "waste-management": { division: "JZ Waste Management", email: "estimating@jzwastemanagement.com" },
  development: { division: "JZ Development", email: "estimating@jzdevelopment.com" },
} as const;

const allowedExtensions = new Set(["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx", "dwg", "dxf", "zip"]);
const text = (data: FormData, key: string) => { const value = data.get(key); return typeof value === "string" ? value.trim() : ""; };
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4 * 1024 * 1024) return NextResponse.json({ ok: false, message: "Keep attachments under 3 MB total or include a plan-room link." }, { status: 413 });

  let data: FormData;
  try { data = await request.formData(); } catch { return NextResponse.json({ ok: false, message: "We could not read this submission." }, { status: 400 }); }
  if (text(data, "companyWebsite")) return NextResponse.json({ ok: true, reference: "RECEIVED" });

  const name = text(data, "name");
  const email = text(data, "email");
  const phone = text(data, "phone");
  const divisionKey = text(data, "division") as keyof typeof contacts;
  const division = contacts[divisionKey];
  const projectType = text(data, "projectType");
  const projectLocation = text(data, "projectLocation");
  const facilityStatus = text(data, "facilityStatus");
  const timeline = text(data, "timeline");
  const message = text(data, "message");

  if (!name || !validEmail(email) || !division || !projectType || !projectLocation || !facilityStatus || !message || text(data, "consent") !== "yes") {
    return NextResponse.json({ ok: false, message: "Complete the required fields and try again." }, { status: 400 });
  }

  const files = data.getAll("attachments").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (files.length > 5 || totalBytes > 3 * 1024 * 1024) return NextResponse.json({ ok: false, message: "Attach up to five files under 3 MB total." }, { status: 413 });
  if (files.some((file) => !allowedExtensions.has(file.name.split(".").pop()?.toLowerCase() || ""))) return NextResponse.json({ ok: false, message: "Use PDF, image, Office, DWG, DXF, or ZIP files." }, { status: 415 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || (process.env.RESEND_EMAIL_DOMAIN ? `JZ Group Website <website@${process.env.RESEND_EMAIL_DOMAIN}>` : "");
  if (!apiKey || !from) return NextResponse.json({ ok: false, message: "Online submission is temporarily unavailable. Use the estimating email shown on the page." }, { status: 503 });

  const reference = crypto.randomUUID().split("-")[0].toUpperCase();
  const details = [["Reference", reference], ["Division", division.division], ["Project type", projectType], ["Location", projectLocation], ["Facility status", facilityStatus], ["Timeline", timeline || "Not provided"], ["Name", name], ["Email", email], ["Phone", phone || "Not provided"]];
  const attachments = await Promise.all(files.map(async (file) => ({ filename: file.name.replace(/[^\w.\-() ]/g, "_").slice(0, 140), content: Buffer.from(await file.arrayBuffer()) })));
  const rows = details.map(([label, value]) => `<tr><th align="left" style="padding:6px 16px 6px 0;color:#666">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");

  const resend = new Resend(apiKey);
  const inquiry = await resend.emails.send({ from, to: [division.email], replyTo: email, subject: `[${reference}] Website project inquiry - ${projectType}`, html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5"><h1>New JZ Group project inquiry</h1><table>${rows}</table><h2>Project details</h2><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`, attachments });
  if (inquiry.error) return NextResponse.json({ ok: false, message: "We could not send this request. Use the estimating email shown on the page." }, { status: 502 });

  await resend.emails.send({ from, to: [email], replyTo: division.email, subject: `JZ Group received your request [${reference}]`, html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5"><p>Hi ${escapeHtml(name)},</p><p>Your request has been routed to <strong>${escapeHtml(division.division)}</strong>.</p><table>${rows}</table><p>A member of the estimating team will follow up after review.</p></div>` });
  return NextResponse.json({ ok: true, reference });
}
