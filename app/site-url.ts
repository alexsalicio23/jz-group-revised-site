function withProtocol(value: string) {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

export function getSiteUrl() {
  const previewUrl = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL : undefined;
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const deploymentUrl = previewUrl || configuredUrl || productionUrl || process.env.VERCEL_URL;

  return deploymentUrl ? withProtocol(deploymentUrl).replace(/\/$/, "") : "http://localhost:3100";
}
