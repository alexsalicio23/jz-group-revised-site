import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const isPreviewDeployment = process.env.VERCEL_ENV === "preview";
const companySite = process.env.NEXT_PUBLIC_COMPANY_SITE;
const vercelPreviewSources = isPreviewDeployment
  ? ["https://vercel.live", "https://va.vercel-scripts.com"]
  : ["https://va.vercel-scripts.com"];
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} ${vercelPreviewSources.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${isPreviewDeployment ? " https://vercel.live" : ""}`,
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self' https://*.vercel-insights.com${isPreviewDeployment ? " https://vercel.live wss:" : ""}${isDevelopment ? " ws:" : ""}`,
  `frame-src ${isPreviewDeployment ? "https://vercel.live" : "'none'"}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  ...(!isDevelopment ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    if (!companySite) return [];
    return {
      beforeFiles: [
        { source: "/", destination: `/${companySite}` },
        { source: "/about", destination: `/${companySite}/about` },
        { source: "/projects", destination: `/${companySite}/projects` },
        { source: "/projects/:path*", destination: `/${companySite}/projects/:path*` },
        { source: "/services/:path*", destination: `/${companySite}/services/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      // Five contact pages ran the identical 14-field form against the same
      // /api/contact endpoint. /contact?for=<lane> preselects the service lane.
      { source: "/demolition/contact", destination: "/contact?for=demolition", permanent: true },
      { source: "/construction/contact", destination: "/contact?for=construction", permanent: true },
      { source: "/waste-management/contact", destination: "/contact?for=waste-management", permanent: true },
      { source: "/development/contact", destination: "/contact?for=development", permanent: true },

      // One leadership group presented as three team pages, two of which
      // listed the same four people while the third listed nobody.
      { source: "/demolition/team", destination: "/about#leadership", permanent: true },
      { source: "/construction/team", destination: "/about#leadership", permanent: true },
      { source: "/waste-management/team", destination: "/waste-management/about", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          ...(isPreviewDeployment || process.env.NEXT_PUBLIC_NO_INDEX === "1"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
            : []),
        ],
      },
      {
        source: "/client-login",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
      {
        source: "/client-portal/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
    ];
  },
};

export default nextConfig;
