import { chromium } from 'playwright';

// Regression check for the URL consolidation: every retired route must 301/308
// to its replacement, stay out of the sitemap, and still resolve.
//   npx next build && npx next start -p 3111 &
//   node scripts/check-redirects.mjs
// or against a deployment:  BASE=https://www.jzgroupmiami.com node scripts/check-redirects.mjs
const BASE = process.env.BASE || 'http://127.0.0.1:3111';

const REDIRECTS = [
  ['/demolition/contact', '/contact?for=demolition'],
  ['/construction/contact', '/contact?for=construction'],
  ['/waste-management/contact', '/contact?for=waste-management'],
  ['/development/contact', '/contact?for=development'],
  ['/demolition/team', '/about#leadership'],
  ['/construction/team', '/about#leadership'],
  ['/waste-management/team', '/waste-management/about'],
];

let fail = 0;

console.log('REDIRECTS');
for (const [from, to] of REDIRECTS) {
  const r = await fetch(BASE + from, { redirect: 'manual' });
  const loc = r.headers.get('location') || '';
  const ok = r.status === 308 || r.status === 301;
  const match = loc === to || loc === BASE + to;
  if (!ok || !match) fail++;
  console.log(`  ${ok && match ? 'ok  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${from.padEnd(30)} -> ${loc}`);
}

console.log('\nSITEMAP');
const xml = await fetch(BASE + '/sitemap.xml').then((r) => r.text());
const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, '') || '/');
console.log(`  ${locs.length} urls`);
const retired = REDIRECTS.map(([f]) => f).filter((f) => locs.some((l) => l.replace(/\/$/, '') === f));
if (retired.length) { console.log('  FAIL retired urls still listed:', retired.join(', ')); fail++; }
else console.log('  ok   no retired urls listed');

console.log('\nRETIRED ROUTES RESOLVE (following redirects)');
for (const [from] of REDIRECTS) {
  const r = await fetch(BASE + from);
  const ok = r.status === 200;
  if (!ok) fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${String(r.status)} ${from}`);
}

console.log('\nSERVICE-LANE PRESELECT');
const b = await chromium.launch();
const page = await b.newPage();
for (const lane of ['demolition', 'construction', 'waste-management', 'development']) {
  await page.goto(`${BASE}/contact?for=${lane}`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const v = await page.locator('select[name="division"]').inputValue();
  const ok = v === lane;
  if (!ok) fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} /contact?for=${lane.padEnd(17)} select=${v}`);
}
await page.goto(`${BASE}/contact`, { waitUntil: 'load' });
await page.waitForTimeout(500);
console.log(`  ok   /contact (no param)      select=${await page.locator('select[name="division"]').inputValue()}`);

console.log('\nDIVISION HEADER REACHES THE GROUP PAGES');
await page.goto(`${BASE}/demolition/services/concrete-work`, { waitUntil: 'load' });
const hrefs = await page.locator('header a').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
for (const want of ['/about#leadership', '/contact?for=demolition']) {
  const ok = hrefs.includes(want);
  if (!ok) fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} header links to ${want}`);
}
await b.close();

console.log(fail ? `\n${fail} FAILURES` : '\nall checks passed');
process.exit(fail ? 1 : 0);
