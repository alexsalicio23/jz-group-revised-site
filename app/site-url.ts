function withProtocol(value: string) {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

const defaultProductionUrl = "https://jzdemo.com";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const productionUrl = process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : undefined;
  const deploymentUrl = configuredUrl || productionUrl || defaultProductionUrl;

  return withProtocol(deploymentUrl).replace(/\/$/, "");
}
