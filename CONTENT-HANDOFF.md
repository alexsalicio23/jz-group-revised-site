# JZ Group Content Handoff

## Where to edit

All detailed-page copy and records live in `app/content-data.ts`. Each page object contains:

- `path`: the public URL after its division name
- `title` and `introduction`: first-screen message
- `mediaLabel`: the exact photography needed for the hero placeholder
- `sections`: body copy, service lists, project records, and supporting media placeholders
- `faqs`: expandable reviewer questions
- `related`: internal links shown at the bottom of the page
- `sourceUrl`: the official public JZ page used during migration

The four overview pages use `app/templates/template-data.ts`. Shared navigation is in `components/SiteNavigation.tsx`, and the reusable detail-page design is in `components/ContentPage.tsx`.

## Public page map

### JZ Group

- `/about`
- `/values`
- `/safety`
- `/projects`
- `/contact`

### JZ Demolition

- `/demolition/about`
- `/demolition/team`
- `/demolition/services/interior-demolition`
- `/demolition/services/total-demolition`
- `/demolition/services/concrete-work`
- `/demolition/services/waste-hauling`
- `/demolition/projects`
- `/demolition/projects/healthcare`
- `/demolition/projects/education`
- `/demolition/projects/business-community`
- `/demolition/projects/retail-entertainment`
- `/demolition/contact`

### JZ Waste Management

- `/waste-management/about`
- `/waste-management/team`
- `/waste-management/services/dumpster-rentals`
- `/waste-management/services/temporary-fencing`
- `/waste-management/services/general-labor`
- `/waste-management/services/recycling`
- `/waste-management/contact`

### JZ Construction

- `/construction/about`
- `/construction/team`
- `/construction/services/general-contracting`
- `/construction/services/subcontracting`
- `/construction/projects`
- `/construction/projects/healthcare`
- `/construction/projects/commercial`
- `/construction/contact`

### JZ Development

- `/development/about`
- `/development/projects`
- `/development/contact`

## Replacing placeholders

Every empty media area names the asset it expects. Add approved files under `public/media/`, then replace the matching `MediaPlaceholder` with `next/image` or the approved video component. Keep the current aspect ratio and responsive container so the page layout does not shift while media loads.

Recommended first asset pass:

1. JZ Group team photograph
2. One image connecting all four companies
3. Active-hospital protection and controlled-demolition photography
4. Approved project galleries by market
5. Division team photographs
6. Equipment, containers, fencing, cleanup, framing, and finished-interior details
7. Development project photography with confirmed usage rights

## Before launch

- Confirm names, titles, addresses, emails, and project counts with JZ.
- Confirm every safety, training, equipment, and active-facility statement is current.
- Confirm permission for project names, client logos, and photographs.
- Replace or remove every labeled media placeholder.
- Configure the Resend environment variables used by `/api/contact` and submit a real test scope.
- Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
- Remove the private `/templates` review archive when it is no longer needed.
