import "server-only";

export type PortalPhase = {
  name: string;
  progress: number;
  summary: string;
};

export type PortalPageStatus = {
  page: string;
  status: "Complete" | "In progress" | "Waiting on JZ";
  detail: string;
  href: string;
};

export type PortalUpdate = {
  id: string;
  title: string;
  date: string;
  url?: string;
};

export const portalPhases: readonly PortalPhase[] = [
  { name: "Strategy and positioning", progress: 100, summary: "Group-level positioning and the four-company structure are approved in the current build." },
  { name: "Core website experience", progress: 92, summary: "Navigation, cinematic storytelling, responsive layouts, and primary conversion paths are in place." },
  { name: "Project and team content", progress: 58, summary: "Portfolio and team structures are ready; approved photography and final contact details are being populated." },
  { name: "Company websites", progress: 68, summary: "All four company site structures are built and linked; final division copy and media remain." },
  { name: "Qualifications and launch review", progress: 62, summary: "Prequalification access and technical checks are active; verified qualification data and final client review remain." },
] as const;

export const portalPageStatuses: readonly PortalPageStatus[] = [
  { page: "Homepage", status: "In progress", detail: "Core experience is live; final field photography and copy review remain.", href: "/" },
  { page: "Project portfolio", status: "Waiting on JZ", detail: "Twenty-one project records are loaded with photo placeholders.", href: "/projects#portfolio" },
  { page: "About and team", status: "Waiting on JZ", detail: "Roster and available portraits are loaded; remaining portraits and contacts are pending.", href: "/about" },
  { page: "Prequalification", status: "Waiting on JZ", detail: "Presentation is ready for verified licenses, insurance, bonding, and safety data.", href: "/values" },
  { page: "Contact and bid routing", status: "In progress", detail: "The routed project form is built; final delivery configuration requires launch verification.", href: "/contact" },
  { page: "Company websites", status: "In progress", detail: "The four-company audit repairs passed verification. Mobile, navigation, contact, privacy, and content updates are included in this release; final content and domain approvals remain.", href: "/services" },
] as const;

export const portalActionItems = [
  "Approved photography for the 21 project portfolio records",
  "Remaining team portraits, emails, and direct contact details",
  "Verified licenses, insurance, bonding, safety, and qualification figures",
  "Final Instagram, Facebook, and LinkedIn profile links",
  "Approved project summaries, scope details, and performance metrics",
  "Confirmed JZ delivery roles for Development portfolio listings and Construction case studies",
  "Final company domains, privacy-notice review, and verified inquiry receipt before launch",
] as const;

const fallbackUpdates: readonly PortalUpdate[] = [
  { id: "company-site-audit", title: "Completed audit repairs across all four company websites and fixed mobile Qualifications text", date: "Sep 5, 2026" },
  { id: "portfolio", title: "Added the updated 21-project portfolio", date: "Aug 26, 2026" },
  { id: "team", title: "Added footer socials and team contact profiles", date: "Aug 26, 2026" },
  { id: "navigation", title: "Simplified and repaired navigation dropdowns", date: "Aug 26, 2026" },
  { id: "panels", title: "Redesigned industrial information panels", date: "Aug 26, 2026" },
  { id: "responsive", title: "Completed laptop and mobile layout repairs", date: "Aug 25, 2026" },
] as const;

function friendlyDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(value));
}

async function recentGitHubUpdates(): Promise<readonly PortalUpdate[]> {
  try {
    const revision = process.env.JZ_RELEASE_COMMIT
      || process.env.VERCEL_GIT_COMMIT_SHA
      || process.env.VERCEL_GIT_COMMIT_REF
      || "main";
    const query = new URLSearchParams({ sha: revision, per_page: "8" });
    const response = await fetch(
      `https://api.github.com/repos/alexsalicio23/jz-group-revised-site/commits?${query}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "jz-group-client-portal",
        },
        next: { revalidate: 300 },
      },
    );
    if (!response.ok) return fallbackUpdates;

    const commits = await response.json() as Array<{
      sha: string;
      html_url: string;
      commit: { message: string; author: { date: string } };
    }>;
    return commits.map((item) => ({
      id: item.sha,
      title: item.commit.message.split("\n")[0],
      date: friendlyDate(item.commit.author.date),
      url: item.html_url,
    }));
  } catch {
    return fallbackUpdates;
  }
}

async function publicSiteOnline() {
  try {
    const response = await fetch("https://www.jzgroupmiami.com", {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getPortalSnapshot() {
  const [updates, siteOnline] = await Promise.all([recentGitHubUpdates(), publicSiteOnline()]);
  const progress = Math.round(portalPhases.reduce((sum, phase) => sum + phase.progress, 0) / portalPhases.length);

  return {
    updates,
    siteOnline,
    progress,
    lastUpdated: updates[0]?.date ?? "Aug 26, 2026",
  };
}
