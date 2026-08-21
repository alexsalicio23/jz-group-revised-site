// Checks every indexed page's <title> and <meta description> against the limits
// search results actually enforce. Run against a built site:
//   npx next build && npx next start -p 3111 &
//   node scripts/check-seo.mjs
// or point at a deployment:  BASE=https://www.jzgroupmiami.com node scripts/check-seo.mjs
const BASE = process.env.BASE || 'http://127.0.0.1:3111';
const urls = [
  '/', '/demolition', '/construction', '/waste-management', '/development',
  '/about', '/values', '/safety', '/projects', '/contact',
  '/demolition/about', '/demolition/team',
  '/demolition/services/interior-demolition', '/demolition/services/total-demolition',
  '/demolition/services/concrete-work', '/demolition/services/waste-hauling',
  '/demolition/projects', '/demolition/projects/healthcare', '/demolition/projects/education',
  '/demolition/projects/business-community', '/demolition/projects/retail-entertainment',
  '/demolition/contact',
  '/waste-management/about', '/waste-management/team',
  '/waste-management/services/dumpster-rentals', '/waste-management/services/temporary-fencing',
  '/waste-management/services/general-labor', '/waste-management/services/recycling',
  '/waste-management/contact',
  '/construction/about', '/construction/team',
  '/construction/services/general-contracting', '/construction/services/subcontracting',
  '/construction/projects', '/construction/projects/healthcare', '/construction/projects/commercial',
  '/construction/contact',
  '/development/about', '/development/projects', '/development/contact',
];

const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

let failTitle = 0, failDesc = 0, noGeo = 0, sameAsH1 = 0;
const rows = [];
for (const u of urls) {
  const html = await fetch(BASE + u).then((r) => r.text());
  const title = dec((html.match(/<title>([^<]*)<\/title>/) || [, ''])[1]);
  const desc = dec((html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]);
  const h1 = dec((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]*>/g, '').trim());
  const geo = /miami|florida|broward|dade|lauderdale|palm beach/i.test(title);
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const h1Title = norm(title.split('|')[0]) && norm(h1).startsWith(norm(title.split('|')[0]).slice(0, 30));
  if (title.length > 60) failTitle++;
  if (desc.length > 160 || desc.length < 110) failDesc++;
  if (!geo) noGeo++;
  if (h1Title) sameAsH1++;
  rows.push({ u, t: title.length, d: desc.length, geo, h1Title, title });
}

console.log('len  desc  geo  url');
for (const r of rows) {
  const flag = r.t > 60 || r.d > 160 || r.d < 110 ? ' <-- OUT OF RANGE' : '';
  console.log(`${String(r.t).padStart(3)}  ${String(r.d).padStart(4)}  ${r.geo ? ' y ' : ' - '}  ${r.u}${flag}`);
}
console.log(`\n${rows.length} pages`);
console.log(`titles > 60 chars : ${failTitle}`);
console.log(`descriptions out of 110-160 : ${failDesc}`);
console.log(`titles with a geo term : ${rows.length - noGeo} / ${rows.length}`);
console.log(`titles that are still the H1 sentence : ${sameAsH1}`);
process.exit(failTitle + failDesc > 0 ? 1 : 0);
