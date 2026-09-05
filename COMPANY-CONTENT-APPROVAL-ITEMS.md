# Company Content Approval Items

Content fixes for the September 4, 2026 four-company audit. This is an internal review checklist, not approved public project attribution.

## Development Property References

All seven names and their existing locations remain on the site. They are now presented as property references with an explicit statement that a listing does not establish JZ's role. No project-specific images or developer/GC delivery claims were added.

JZ must approve each entry independently:

| Retained property | Required confirmation |
| --- | --- |
| Villa Valencia | JZ entity, actual role, scope, dates, reference permission, property-matched photography |
| AquaVue Las Olas | JZ entity, actual role, scope, dates, reference permission, property-matched photography |
| AquaMar Las Olas | JZ entity, actual role, scope, dates, reference permission, property-matched photography |
| AquaBlu Fort Lauderdale | JZ entity, actual role, scope, dates, reference permission, property-matched photography |
| 1800 Las Olas | JZ entity, actual role, scope, dates, reference permission, property-matched photography |
| AquaLuna Las Olas | JZ entity, actual role, scope, dates, reference permission, property-matched photography |
| AquaVita Las Olas | JZ entity, actual role, scope, dates, reference permission, property-matched photography |

Distinguish developer, owner, construction manager, general contractor, subcontractor, and individual team-member prior experience. A building's characteristics do not establish JZ's participation.

Unverified counts, dimensions, completion dates, and the potentially stale AquaBlu design-phase statement were removed from the public descriptions, not promoted to approved facts. Confirm before restoring them. The broader workforce-housing focus remains separate from these named residential properties; no listing is newly categorized as workforce housing.

## Development Leadership And Media

- The existing division roster remains unchanged: Alexander DeArmas / President; Zenaida Balseiro / Secretary; Alberto DeArmas / Head of Development; Christopher Carter / Vice President. Confirm spelling, current titles, and whether this roster is intentionally different from the group roster.
- Expanded biographies and the unverified 20+ combined-experience claim were removed pending approval. No biographies or portraits were invented.
- The existing residential kitchen is labeled representative. It is not identified as one of the seven properties or evidence of a confirmed development role. Repeated kitchen media previously presented as a leadership/community/project gallery was removed; all property entries remain.
- Approve property-specific exterior images, rights, captions, and exact project association before replacement.

## Construction

- The healthcare page retains the existing construction image and identifies it visibly as representative commercial framing, using the existing 100 Biscayne asset mapping. It expressly does not document the healthcare projects listed on that page.
- Confirm the inherited image mapping and obtain approved healthcare-specific photography before presenting a named healthcare case study.
- The homepage no longer places a named "Lead project" beside "GC + subcontracting" in a way that could imply a verified GC role at that property. Company capabilities remain distinct from project attribution.
- Still needed: one approved GC or management case study with JZ's actual delivery role, dates, scope, client-reference permission, and matched photography. Do not convert a trade scope into a whole-project GC claim.

## Demolition

- The Robotic demolition card now targets the explicit `#robotic-demolition` section on Concrete Services. Copy is limited to the remote demolition capability already stated in JZ's content and a project-specific method review.
- No equipment manufacturer, model, ownership, output, emissions, access dimensions, or robotic project statistics were added. Obtain approval for such details before expanding the service story.
- The existing Baptist Medical Arts Building scope and 16,300 SF statement were not changed. No new project-photo association or landscape replacement was made; the portrait feature still requires framing review or an approved matching landscape image.

## Integration And Verification

- Waste rental links use the forms worker's `buildContactIntentHref` helper and remain local: `/contact?for=waste-management&inquiry=rental&container=15-trailer|15-rolloff|20-rolloff|30-rolloff`, with one token per CTA. Shared contact handoff, intake, and email behavior belong to the forms worker.
- Captions use existing `.metric-record-note` styling plus the `.metric-media-caption` hook. Section media is associated with its visible caption through `aria-describedby`. No CSS files were edited by this worker.
- `DivisionOverview.tsx` was untouched and released to the motion worker. The cinematic homepage and four-card choreography were untouched.
- Seven content-contract tests passed with `npx playwright test --config tests company-content-audit.spec.ts --grep "company content contract" --workers=1`. This command does not start the repository's build-configured web server.
- `npx tsc --noEmit --incremental false` and scoped ESLint passed. Four company-specific browser checks are included in `tests/company-content-audit.spec.ts`; they require an existing company server and configured Playwright base URL and were not run by this worker.
- No branch, commit, build, deployment, environment, DNS, indexing, or real-email changes were made by this worker. Contact delivery and other launch approval blockers remain separate from these content fixes.
