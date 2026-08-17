import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/app/site-url";
import { buildPageMetadata } from "@/app/seo";
import { OrganizationStructuredData } from "@/components/StructuredData";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "JZ Group",
  ...buildPageMetadata({
    title: "JZ Group | Specialty Demolition in Active Environments",
    description: "JZ Group delivers specialty demolition, construction, waste management, and development services across South Florida.",
    path: "/",
    image: "/media/og-image.jpg",
    imageAlt: "JZ Group field operations in South Florida",
  }),
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
  robots: process.env.VERCEL_ENV === "preview"
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
