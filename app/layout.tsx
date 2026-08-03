import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jz-group-redesign-v2.vercel.app"),
  title: "JZ Group | Four Specialists. One Accountable Group.",
  description:
    "JZ Group coordinates specialty demolition, construction, waste management, and development across South Florida.",
  openGraph: {
    title: "JZ Group | Four Specialists. One Accountable Group.",
    description:
      "Specialty demolition, construction, waste management, and development coordinated under one field standard.",
    images: [{ url: "/media/og-image.jpg", width: 1200, height: 630, alt: "JZ Group field operations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JZ Group | Four Specialists. One Accountable Group.",
    description: "Four coordinated companies built for difficult work in active environments.",
    images: ["/media/og-image.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${neue.variable} ${frama.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
