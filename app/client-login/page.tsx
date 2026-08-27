import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { hasClientPortalSession, isClientPortalConfigured } from "@/lib/client-portal-auth";

export const metadata: Metadata = {
  title: "Client Login | JZ Group",
  description: "Secure access to the JZ Group website progress portal.",
  robots: { index: false, follow: false, nocache: true },
};

type ClientLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<string, string> = {
  invalid: "The access ID or password was not recognized.",
  limited: "Too many attempts were received. Wait 15 minutes and try again.",
  configuration: "The client portal is awaiting its production access credentials.",
};

export default async function ClientLoginPage({ searchParams }: ClientLoginPageProps) {
  if (await hasClientPortalSession()) redirect("/client-portal");

  const { error } = await searchParams;
  const configured = isClientPortalConfigured();

  return (
    <main className="portal-login-shell" id="top">
      <section className="portal-login-panel" aria-labelledby="client-login-title">
        <Link className="portal-back-link" href="/">
          <ArrowLeft aria-hidden="true" size={16} />
          Return to website
        </Link>

        <div className="portal-login-brand">
          <Image src="/media/brand-logo.webp" alt="JZ Group" width={164} height={82} priority />
          <span>Client progress portal</span>
        </div>

        <div className="portal-login-copy">
          <LockKeyhole aria-hidden="true" size={28} />
          <h1 id="client-login-title">Website Progress</h1>
          <p>Sign in to review current progress, recent releases, and the items needed for the next website phase.</p>
        </div>

        {error && errors[error] ? <p className="portal-form-alert" role="alert">{errors[error]}</p> : null}

        <form className="portal-login-form" action="/api/client-portal/login" method="post">
          <label htmlFor="accessId">Access ID</label>
          <input id="accessId" name="accessId" autoComplete="username" required disabled={!configured} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required disabled={!configured} />

          <button type="submit" disabled={!configured}>Open dashboard</button>
        </form>

        <p className="portal-login-note">Access is limited to JZ Group and the website project team.</p>
      </section>
      <aside className="portal-login-aside" aria-label="Portal overview">
        <p>One place to follow the work</p>
        <ul>
          <li>Live website status</li>
          <li>Page-by-page progress</li>
          <li>Recent published updates</li>
          <li>Items awaiting client review</li>
        </ul>
      </aside>
    </main>
  );
}
