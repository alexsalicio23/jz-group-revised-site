# JZ Group Flagship - Locked Redesign Blueprint

## Delivery Target

- Client review: Wednesday, August 5, 2026.
- Primary review environment: desktop presentation with the presenter in the room.
- Working base: `jz-group-redesign-v2`.
- The current public deployment remains intact until the new presentation build passes review.

## The Intended Reaction

The first reaction should be: **This is unlike any other competitor.**

Within five seconds, a GC reviewer should understand this hierarchy:

1. JZ Group is four coordinated specialist companies.
2. JZ specializes in difficult demolition and complex work.
3. JZ can operate safely in active and occupied environments.
4. JZ has the experience and field capability to perform the work.

## Creative Direction

- Experimental level: 5/5, concentrated into a few signature interactions.
- Palette: black, graphite, gray, concrete, and white only.
- No orange or decorative accent color.
- Typography: industrial display typography paired with highly legible modern body text.
- Visual tone: cinematic, technical, controlled, assured, and uncluttered.
- The page begins near-black and progressively opens into white and concrete sections.
- Use the existing JZ logo without recoloring unless JZ approves an alternate mark.

## Non-Negotiable Rules

- JZ Group, not JZ Demolition, owns the first viewport.
- All four divisions receive equal visual weight.
- Division order: Demolition, Construction, Waste Management, Development.
- No custom cursor.
- No choppy frame-scrub animation.
- No generic floating-card reveals, decorative lines, ambient blobs, or animation on every element.
- No vertical media on the homepage.
- Do not use unapproved or generated project imagery in the presentation build.
- Use deliberate landscape placeholders until the real JZ library is selected.
- The exploded-view idea remains a reserved placeholder. Do not invent or generate it yet.
- The homepage must summarize. Deep detail belongs on division, project, safety, and company pages.

## Homepage Architecture

Target: five to six meaningful viewport chapters, approximately half the length of the current page.

### 1. Interactive JZ Group Hero

Hero lockup:

- H1: `JZ GROUP`
- Supporting statement: `Four specialists. One accountable group.`
- Short proof line: `Specialty demolition, construction, waste management, and development coordinated under one standard.`

The first viewport contains four equal division fields. On pointer hover or keyboard focus:

- The selected field expands smoothly while the other three compress without disappearing.
- A labeled 16:9 media placeholder becomes prominent.
- One short capability statement appears.
- The division number and name remain visible at all times.
- Clicking leads to the correct permanent division route.

On touch devices, the same content works through tap selection rather than hover.

Motion should feel architectural: controlled mass, clean easing, and no bouncing or novelty effects.

### 2. Specialty Demolition

- Lead message: specialty demolition in active hospitals, occupied facilities, and complex commercial sites.
- Reserve a large landscape region for the future exploded-view experience.
- For this presentation build, show an intentional technical placeholder labeled `EXPLODED-VIEW STUDY / MEDIA PENDING`.
- Keep supporting copy compact and immediately legible.
- Link to the full Specialty Demolition page.

### 3. Active Environments and Safety

- Combine operational method and safety into one chapter rather than two long sections.
- Present `Plan`, `Protect`, `Execute`, and `Turn Over` as interactive controls.
- Selecting a control changes a concise explanation and a landscape media placeholder.
- Link every control to the detailed Active Facilities page.
- Show four qualification topics as interactive text rows, not decorative cards.
- Do not make unverified infection-control, insurance, bonding, or performance claims.

### 4. Selected Work

- Show exactly three featured project tiles on the homepage.
- Use consistent landscape placeholders with project name, market, and location only.
- Hover reveals a restrained summary and action.
- Clicking a tile expands it from its grid position into a full-viewport project preview.
- The preview includes essential facts, a small image sequence placeholder, close control, and `View full case study`.
- The full Projects page contains the larger gallery and permanent case-study routes.
- Do not restore the `Proof, not promises` stat-led section.

### 5. Credibility and Contact

- Client and contractor logos begin monochrome and reveal approved original color on hover or focus.
- Keep the logo treatment quiet and avoid boxing every logo into a separate card.
- Simplify `The company behind the bid` to one short paragraph and one wide team-photo placeholder.
- Place the four-company group-photo placeholder on the About page rather than forcing it into the homepage.
- End with visible estimating phone and email plus a short bid-context form.

## Signature Motion System

Only three interactions receive major motion:

1. The four-division hero expansion.
2. The future exploded-view experience.
3. The project tile-to-fullscreen transition.

Everything else uses restrained opacity, clipping, or positional transitions with one shared easing system. All animation must support `prefers-reduced-motion`.

## Placeholder System

Placeholders should look intentional enough for client review, not like missing files.

- Ratios: 16:9 for standard media, 21:9 only for the team image.
- Treatment: graphite field, subtle concrete texture, thin internal registration mark, and a concise asset label.
- Required labels: division photo, active hospital work, controlled demolition, safety/protection, equipment, finished interior, before/after pair, completed building, selected project, and team photo.
- Each placeholder should state its target crop and asset purpose in small text.
- No stock photographs or AI stand-ins.

## Navigation and Routes

Primary navigation:

- Group
- Specialty Demolition
- Active Facilities
- Projects
- Safety
- Contact

Permanent division routes:

- `/divisions/demolition`
- `/divisions/construction`
- `/divisions/waste-management`
- `/divisions/development`

Remove public-facing `/templates/*` language before client presentation.

## Conversion Requirements

- Replace qualification and bid-request `mailto:` calls to action with a real form endpoint.
- Fields: service lane, project type, location, active/occupied status, timeline, project details, contact information, and optional file upload.
- Keep the estimating phone and email visible as direct alternatives.
- Use clear submission language such as `Send project details`.
- Do not imply that a request was submitted when it only opened an email client.

## Performance Requirements

The presentation build must fix the current media defects before adding more motion.

- Do not request 3840px assets for small logos or half-width media.
- Set accurate responsive `sizes` values for every Next Image.
- Use posters or placeholder backgrounds so pinned scenes never paint as solid black.
- Do not render desktop and mobile media-heavy variants simultaneously.
- Load only the active division image and preload the next likely selection.
- Remove duplicate hidden video elements and raw media URLs from fallback markup.
- Avoid autoplay video in the new photo-led hero.
- Target LCP at or below 2.5 seconds, INP at or below 200 ms, and CLS at or below 0.1.

## Audit Reconciliation

Apply from the external v2 audit:

- Performance repairs and elimination of black media gaps.
- Accurate responsive image sizing.
- One rendered division experience instead of duplicate media trees.
- Stronger type hierarchy and restoration of technical mono labels where useful.
- A real bid-routing form with optional upload.
- Permanent division and project routes.
- Contrast corrections.

Do not carry forward from that audit:

- Orange progress rails or orange UI accents.
- A demolition-first video hero.
- A long pinned chain requiring extensive scrolling.
- The stat-heavy `Proof, not promises` presentation.
- More video before the photography and exploded-view direction is approved.

## Approval Checklist

- The group structure is clear within five seconds.
- All four divisions feel equal.
- Specialty demolition is the second unmistakable message.
- A reviewer can reach projects, safety, and contact in under thirty seconds.
- The homepage feels complete in five to six chapters.
- No placeholder is vertical, broken, or ambiguous.
- There are no orange accents or custom cursor behavior.
- Hover interactions also work by keyboard and tap.
- No black paint gaps appear during normal or rapid scrolling.
- The project preview opens and closes without losing scroll position.
- The form submits to a real endpoint and communicates success or failure honestly.
- Desktop and mobile pass overlap, clipping, contrast, and reduced-motion checks.
