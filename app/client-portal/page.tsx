import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Clock3,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { hasClientPortalSession } from "@/lib/client-portal-auth";
import {
  getPortalSnapshot,
  portalActionItems,
  portalPageStatuses,
  portalPhases,
} from "./portal-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website Progress | JZ Group",
  description: "Private JZ Group website progress dashboard.",
  robots: { index: false, follow: false, nocache: true },
};

function statusIcon(status: (typeof portalPageStatuses)[number]["status"]) {
  if (status === "Complete") return <Check aria-hidden="true" size={14} />;
  if (status === "Waiting on JZ") return <CircleAlert aria-hidden="true" size={14} />;
  return <Clock3 aria-hidden="true" size={14} />;
}

export default async function ClientPortalPage() {
  if (!(await hasClientPortalSession())) redirect("/client-login");
  const snapshot = await getPortalSnapshot();

  return (
    <main className="portal-shell" id="top">
      <header className="portal-header">
        <Link className="portal-brand" href="/client-portal" aria-label="JZ Group client portal">
          <Image src="/media/brand-logo.webp" alt="" width={120} height={60} priority />
          <span>Website progress</span>
        </Link>
        <nav aria-label="Client portal actions">
          <a href="https://www.jzgroupmiami.com" target="_blank" rel="noreferrer">
            View live site
            <ExternalLink aria-hidden="true" size={15} />
          </a>
          <form action="/api/client-portal/logout" method="post">
            <button type="submit">
              Sign out
              <LogOut aria-hidden="true" size={15} />
            </button>
          </form>
        </nav>
      </header>

      <div className="portal-content">
        <section className="portal-intro" aria-labelledby="portal-title">
          <div>
            <p className="portal-kicker">JZ Group website project</p>
            <h1 id="portal-title">Progress Dashboard</h1>
            <p>Review what is live, what is being built, and what the project needs next.</p>
          </div>
          <dl className="portal-live-status">
            <div>
              <dt>Public website</dt>
              <dd className={snapshot.siteOnline ? "is-online" : "is-offline"}>
                <span aria-hidden="true" />
                {snapshot.siteOnline ? "Online" : "Check required"}
              </dd>
            </div>
            <div>
              <dt>Last release</dt>
              <dd>{snapshot.lastUpdated}</dd>
            </div>
          </dl>
        </section>

        <section className="portal-overview" aria-labelledby="overall-progress-title">
          <div className="portal-progress-summary">
            <span>{snapshot.progress}%</span>
            <div>
              <h2 id="overall-progress-title">Overall Progress</h2>
              <p>Current working estimate across design, development, content, and launch preparation.</p>
            </div>
          </div>
          <div className="portal-progress-track" aria-label={`${snapshot.progress}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={snapshot.progress}>
            <span style={{ width: `${snapshot.progress}%` }} />
          </div>
        </section>

        <section className="portal-section" aria-labelledby="phase-title">
          <div className="portal-section-heading">
            <h2 id="phase-title">Project Phases</h2>
            <span>{portalPhases.length} workstreams</span>
          </div>
          <div className="portal-phase-list">
            {portalPhases.map((phase, index) => (
              <article key={phase.name}>
                <span className="portal-phase-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="portal-phase-copy">
                  <h3>{phase.name}</h3>
                  <p>{phase.summary}</p>
                </div>
                <div className="portal-phase-meter">
                  <strong>{phase.progress}%</strong>
                  <span><i style={{ width: `${phase.progress}%` }} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="portal-section" aria-labelledby="page-status-title">
          <div className="portal-section-heading">
            <h2 id="page-status-title">Page Status</h2>
            <span>Current website scope</span>
          </div>
          <div className="portal-page-table">
            <div className="portal-page-row portal-page-row-head" aria-hidden="true">
              <span>Area</span><span>Status</span><span>Current position</span><span>Review</span>
            </div>
            {portalPageStatuses.map((item) => (
              <div className="portal-page-row" key={item.page}>
                <strong>{item.page}</strong>
                <span className={`portal-status portal-status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>
                  {statusIcon(item.status)}
                  {item.status}
                </span>
                <p>{item.detail}</p>
                <Link href={item.href} aria-label={`Review ${item.page}`}>
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <div className="portal-split">
          <section className="portal-section portal-updates" aria-labelledby="updates-title">
            <div className="portal-section-heading">
              <h2 id="updates-title">Recent Releases</h2>
              <span>Synced from GitHub</span>
            </div>
            <ol>
              {snapshot.updates.map((update) => (
                <li key={update.id}>
                  <time>{update.date}</time>
                  {update.url ? (
                    <a href={update.url} target="_blank" rel="noreferrer">
                      {update.title}
                      <ArrowUpRight aria-hidden="true" size={15} />
                    </a>
                  ) : <span>{update.title}</span>}
                </li>
              ))}
            </ol>
          </section>

          <section className="portal-section portal-actions" aria-labelledby="actions-title">
            <div className="portal-section-heading">
              <h2 id="actions-title">Needed From JZ</h2>
              <span>{portalActionItems.length} open items</span>
            </div>
            <ol>
              {portalActionItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
