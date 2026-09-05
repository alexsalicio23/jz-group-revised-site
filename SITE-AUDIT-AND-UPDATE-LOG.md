# JZ Group Flagship Website — Audit and Update Log

**Project:** JZ Group flagship website and connected company pages
**Updated:** September 5, 2026
**Working copy:** `output/jzgroupmiami-medical-hero`

## September 2026 company-site audit release

Source branch: `codex/jz-company-audit-fixes`, based on the verified group production source at `2dc4754`. The sections below this release entry are historical records, not a substitute for the current live-site audit.

- Coordinated implementation through an Astra Ultra lead agent and four bounded implementation agents.
- Repaired company mobile heading wrapping, menu closure/focus, desktop subtitle contrast, and oversized related-service layouts.
- Carried the existing approved gradient logos, current office/Maps link, and footer social placeholders into the company release; added a shared privacy link.
- Centralized company inquiries through a branded handoff to the group contact page. Company contact APIs reject local collection. No cross-origin form POST or duplicated mail-service credentials were introduced.
- Added allowlisted rental/container intent and a shorter waste-rental form while preserving generic bid validation, attachment restrictions, consent, and origin checks.
- Added reduced-motion posters and accessible pause/resume controls for continuous background media, without changing the cinematic drone hero or four-card choreography.
- Corrected Recycling navigation and added a targeted robotic-demolition section. Removed unresolved public Development fields and clarified representative imagery and unverified property attribution.
- Added a factual website privacy notice for client review. This is not legal approval or a compliance certification.
- Corrected the client portal update feed to follow the deployed revision instead of an old hardcoded branch.

Release verification and deployment records are maintained in `output/jz-company-release-2026-09-04`; the original evidence is in `output/jz-division-audit-2026-09-04`. A release is not live until its deployment and production alias are explicitly verified.

Remaining approval items: final company domains/indexing, actual inbox receipt, privacy review, project-role attribution, and matched landscape/project photography. See `COMPANY-CONTENT-APPROVAL-ITEMS.md`. Contact remains statically rendered as previously agreed; rental prefill requires JavaScript, while the standard form remains the no-JavaScript fallback.

## Original intro concept

The flagship intro was conceived as a cinematic, scroll-directed walkthrough of one commercial space as it moves from teardown to completed delivery. The same visual journey introduces the four connected JZ companies—Demolition, Construction, Waste Management, and Development—so the homepage feels like one coordinated operating system rather than four unrelated businesses.

On larger screens, scrolling controls the walkthrough and reveals the company chapters. On smaller screens, the video plays as a lightweight background treatment while the core headline and calls to action remain continuously available. Reduced-motion and data-saver preferences receive a simpler static experience.

## Audit findings

The review covered the live preview, desktop and mobile behavior, content credibility, accessibility, search presentation, performance, forms, and production readiness.

Key findings included:

- The mobile intro could hide the main headline and actions after the video advanced.
- The homepage transferred roughly 8.3 MB in the original lab audit, driven primarily by hero media.
- Some company cards became unavailable to assistive technology during their reveal animation.
- Several public numeric claims did not yet have approved source records.
- Project and office information needed clearer qualification and company-specific labels.
- The contact endpoint permitted broad attachment types and used a cross-company fallback address.
- Canonical URLs, structured data, favicon handling, security headers, and preview indexing controls needed strengthening.
- Production email-routing variables and the final public site URL were not configured in the local environment.

## Work completed

### Homepage intro and media

- Preserved the cinematic walkthrough concept while making it progressively enhanced.
- Kept the headline and both primary calls to action visible throughout the mobile experience.
- Added reduced-motion and data-saver handling.
- Delayed mobile video playback so the first screen can render before loading the motion layer.
- Re-encoded separate desktop and mobile walkthrough files and created a WebP poster.
- Reduced the primary desktop video from about 7.5 MB to 2.7 MB and the mobile video from about 6.7 MB to 2.2 MB.
- Added long-lived caching for versioned media files.
- Corrected the desktop scroll distance so each chapter has adequate reading time.
- Removed the public client-logo wall until JZ confirms each relationship and trademark permission; replaced it with a neutral markets-served band.
- Corrected the Development image so it represents development work rather than demolition.

### Accessibility and interaction

- Kept all four company links in the accessibility tree throughout the reveal sequence.
- Added dependable keyboard-focus visibility for company cards.
- Removed an accessible-label mismatch from project-gallery controls.
- Confirmed there is no horizontal overflow at tested mobile and desktop widths.
- Confirmed the final local browser run produced no console errors or warnings.

### Content and credibility

- Removed unsupported public claims including `50+`, `25+`, `33+`, `45+`, and `5+` figures pending approved source records.
- Replaced those figures with qualitative, supportable language.
- Added qualification notes explaining that dates, complete scopes, and approved references are available through estimating.
- Labeled the JZ Group and company offices explicitly instead of presenting addresses without context.
- Standardized public terminology around “companies” and “Waste Management.”
- Replaced internal client-review wording with public-facing Development copy.
- Updated the content handoff document with the remaining approval and evidence requirements.

### Contact form and routing security

- Added a required Company field so every B2B inquiry identifies the requesting organization.
- Made every required field visibly identifiable, including the consent control.
- Added a real plan-room/document-link field and clarified that direct uploads are only for small PDF or image excerpts.
- Added an explicit form action, POST method, and multipart encoding.
- Limited direct uploads to PDF, PNG, JPEG, and WebP files.
- Added file-count, file-size, request-size, and field-length limits.
- Added MIME-type and file-signature checks to reject disguised uploads.
- Added origin and fetch-site checks, input escaping, filename sanitation, and rate limiting.
- Removed the Demolition inbox as a fallback for other companies.
- Required a dedicated delivery variable for each company.
- Kept confirmation-email failure separate from inquiry delivery so a delivered lead is not falsely reported as lost.
- Added automated coverage for cross-site requests, unsupported archives, disguised PDFs, and form configuration.

### Search, metadata, and browser security

- Added canonical metadata to the homepage, static pages, company pages, and nested content pages.
- Added unique Open Graph and Twitter titles, descriptions, URLs, and division-specific images across all public company and content pages.
- Added LocalBusiness, WebSite, Service, service-catalog, and Breadcrumb structured data.
- Added an application favicon.
- Prevented preview deployments from being indexed through robots metadata, robots.txt, and an `X-Robots-Tag` response header while keeping production indexable.
- Added Content Security Policy, referrer, permissions, content-type, frame, and opener headers.
- Made the configured production URL take priority over temporary preview URLs.
- Disabled local Vercel analytics components when the app is not running on Vercel, eliminating local analytics-route errors.

### Compact centered layout refinement

- Centered every `h1`–`h4` heading across homepage, company, service, project, and contact layouts.
- Rebuilt detailed-page section grids so headings and supporting copy no longer occupy narrow offset columns.
- Increased primary supporting copy to roughly 20px on desktop and 18px on mobile.
- Restored the homepage supporting line on mobile and kept it visible with both primary actions after video playback begins.
- Reduced the desktop cinematic hero from 3.6 viewport heights to 1.9 while preserving all four scroll-controlled chapters.
- Reduced repeated section padding, oversized minimum heights, media-panel heights, card heights, and inter-section gaps.
- Reduced the measured desktop homepage length by roughly 2,300px at a 1280 × 720 viewport without hiding content.
- Kept forms and list-style content left-aligned where scanning accuracy is more important than centered presentation.
- Increased mobile form controls to 16px, labels to approximately 13px, and the menu trigger to a minimum 44 × 44px target.
- Tightened the mobile project dialog to the dynamic viewport and safe-area insets.

### Documentation and launch controls

- Expanded `.env.example` with the public site URL and four company-specific delivery variables.
- Added `npm run check:launch` to identify missing production settings before release.
- Updated the README with security and launch guidance.
- Updated `CONTENT-HANDOFF.md` with content ownership, routing, evidence, and approval requirements.

## Verification completed

- ESLint: passed.
- TypeScript: passed with no emitted files.
- Production build: passed; 52 routes generated.
- Automated browser tests: 53 passed and 5 intentional cross-breakpoint tests skipped.
- Desktop browser review: passed.
- Mobile browser review at 390 × 844: passed, including persistent headline and actions after video playback.
- Contact-page form, canonical URL, structured data, office labeling, and upload restrictions: passed.
- Security-response headers and favicon response: passed.
- Git whitespace validation: passed.
- Local Lighthouse runs reached 100 for Accessibility, Best Practices, and SEO. Performance varied from 87–90, with LCP around 3.5–4.0 seconds; hero loading remains the main performance follow-up.
- Page transfer fell from the original roughly 8.3 MB to about 0.7–2.7 MB in local lab runs, depending on whether the delayed video loaded during the measurement window.
- The compact layout regression suite passed 53 active tests with 5 intentional breakpoint skips; all headings were centered and no horizontal overflow or browser-console errors were found at desktop and 390 × 844 mobile sizes.

## Required before production release

The code is ready for a configured release, but the working environment is intentionally not marked launch-ready yet. The following values are still required:

- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `DEMOLITION_ESTIMATING_EMAIL`
- `CONSTRUCTION_ESTIMATING_EMAIL`
- `WASTE_ESTIMATING_EMAIL`
- `DEVELOPMENT_ESTIMATING_EMAIL`
- Either `CONTACT_FROM_EMAIL` or `RESEND_EMAIL_DOMAIN`

The business team should also complete these checks:

- Confirm all public office addresses, names, phone numbers, and company-routing inboxes.
- Approve photography and project references before publication. Client logos are not rendered and should only be restored after each relationship and trademark permission is confirmed.
- Supply dated source records before restoring any quantified performance or experience claims.
- Submit one real inquiry to each company after deployment and confirm receipt, reply-to behavior, and confirmation email delivery.
- Add platform-level malware scanning or a dedicated plan-room workflow if broader construction document formats are required.

## Release status

The audited launch-readiness and mobile changes are implemented, verified, and deployed to this Vercel preview:

`https://jz-group-cinematic-refinement-272nustd6.vercel.app`

Vercel reports deployment `dpl_CjyhZt1VJwLGYEGCWcw1F78UJM99` as ready. The 53-test desktop/mobile suite and a second 390 × 844 pass against the deployed build completed without browser-console errors, horizontal overflow, or dialog safe-area overflow.

This remains a noindex preview rather than a production release because the final email API key and company-routing inboxes are not configured. Production canonicals resolve to `https://jzdemo.com`; promotion should wait until the environment check passes and all four routing paths receive a real delivery test.
