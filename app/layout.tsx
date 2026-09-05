import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/app/site-url";
import { buildPageMetadata } from "@/app/seo";
import { OrganizationStructuredData } from "@/components/StructuredData";
import { getActiveCompanySite } from "@/app/company-sites";
import { templates } from "@/app/templates/template-data";
import "./globals.css";
import "./sitewide-update.css";
import "./hero-d77.css";
import "./process-d77.css";
import "./mobile-optimization.css";
import "./group-positioning.css";
import "./navigation-improvements.css";
import "./company-sites.css";
import "./portrait-mobile.css";
import "./desktop-optimization.css";
import "./industrial-panels.css";
import "./footer-team-update.css";
import "./portfolio-update.css";
import "./client-portal.css";
import "./company-audit.css";

const neue = localFont({
  src: [
    { path: "./fonts/PPNeueMontreal-Book-RD.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PPNeueMontreal-Medium-RD.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-neue",
  display: "swap",
});

const frama = localFont({
  src: [
    { path: "./fonts/PPFrama-Regular-RD.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PPFrama-Medium-RD.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-frama",
  display: "swap",
});

const activeCompany = getActiveCompanySite();
const activeTemplate = activeCompany ? templates[activeCompany] : null;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: activeTemplate?.name ?? "JZ Group",
  ...buildPageMetadata({
    title: activeTemplate?.seoTitle ?? "Demolition, Construction, Waste and Development | JZ Group",
    description: activeTemplate?.seoDescription ??
      "Four coordinated companies providing demolition, general contracting, subcontracting, waste management and development services across Florida.",
    path: "/",
    image: "/media/og-image.jpg",
    imageAlt: "JZ Group field operations in South Florida",
  }),
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
  robots: process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_NO_INDEX === "1"
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isVercelDeployment = process.env.VERCEL === "1";

  return (
    <html lang="en" className={`${neue.variable} ${frama.variable}`}>
      <body>
        <a className="skip-link" href="#top">Skip to content</a>
        <OrganizationStructuredData />
        {children}
        {isVercelDeployment ? <><Analytics /><SpeedInsights /></> : null}
      </body>
    </html>
  );
}
