# JZ Group Revised Website

Client-review build for the revised JZ Group flagship website and the four connected division websites.

## Live Review

- Flagship: https://jz-group-redesign-v2.vercel.app/
- Division review hub: https://jz-group-redesign-v2.vercel.app/templates
- JZ Demolition: https://jz-group-redesign-v2.vercel.app/templates/demolition
- JZ Waste Management: https://jz-group-redesign-v2.vercel.app/templates/waste-management
- JZ Construction: https://jz-group-redesign-v2.vercel.app/templates/construction
- JZ Development: https://jz-group-redesign-v2.vercel.app/templates/development

The public route system now uses clean division URLs such as `/demolition`, `/construction`, `/waste-management`, and `/development`. The `/templates` paths remain as a private comparison archive and are excluded from search indexing.

## Local Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 in a browser.

## Quality Checks

```bash
npm run lint
npm run build
npm run test:e2e
```

## Project Structure

- `app/content-data.ts`: approved draft copy, source URLs, contacts, page sections, services, and project records
- `app/[division]/[...path]/`: shared route generator for every division subpage
- `app/`: Next.js pages, global styling, metadata, and sitemap
- `components/`: shared and division-specific interface components
- `public/`: approved draft media and brand assets used by the site
- `tests/`: Playwright desktop, mobile, and accessibility checks

See `CONTENT-HANDOFF.md` for the complete page map, image-placeholder workflow, and launch verification list. Public claims, project media, contact details, and final division names should be reconfirmed with JZ before launch.
