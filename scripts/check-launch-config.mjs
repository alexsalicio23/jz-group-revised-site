const required = [
  "NEXT_PUBLIC_SITE_URL",
  "RESEND_API_KEY",
  "DEMOLITION_ESTIMATING_EMAIL",
  "CONSTRUCTION_ESTIMATING_EMAIL",
  "WASTE_ESTIMATING_EMAIL",
  "DEVELOPMENT_ESTIMATING_EMAIL",
];

const missing = required.filter((name) => !process.env[name]?.trim());
const hasSender = Boolean(process.env.CONTACT_FROM_EMAIL?.trim() || process.env.RESEND_EMAIL_DOMAIN?.trim());

if (!hasSender) missing.push("CONTACT_FROM_EMAIL or RESEND_EMAIL_DOMAIN");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (siteUrl) {
  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:") missing.push("NEXT_PUBLIC_SITE_URL must use https");
  } catch {
    missing.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
  }
}

if (missing.length) {
  console.error("Launch configuration is incomplete:");
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log("Launch configuration is complete. Submit one test inquiry for each JZ company before promotion.");
}
