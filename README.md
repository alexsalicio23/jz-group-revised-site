# JZ Group Revised Website

Private client-review build for the revised JZ Group flagship website and four division website directions.

## Live Review

- Flagship: https://jz-group-redesign-v2.vercel.app/
- Division review hub: https://jz-group-redesign-v2.vercel.app/templates
- JZ Demolition: https://jz-group-redesign-v2.vercel.app/templates/demolition
- JZ Waste Management: https://jz-group-redesign-v2.vercel.app/templates/waste-management
- JZ Construction: https://jz-group-redesign-v2.vercel.app/templates/construction
- JZ Development: https://jz-group-redesign-v2.vercel.app/templates/development

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

- `app/`: Next.js pages, global styling, metadata, and template content
- `components/`: shared and division-specific interface components
- `public/`: approved draft media and brand assets used by the site
- `tests/`: Playwright desktop, mobile, and accessibility checks

The `/templates` routes are intentionally marked `noindex` while they remain private client-review concepts. Public claims, project media, contact details, and final division names should be reconfirmed with JZ before launch.
