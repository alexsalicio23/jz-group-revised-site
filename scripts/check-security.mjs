const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.jzgroupmiami.com").replace(/\/$/, "");

const failures = [];

function check(condition, message) {
  if (condition) console.log(`PASS  ${message}`);
  else {
    failures.push(message);
    console.error(`FAIL  ${message}`);
  }
}

async function get(path, options) {
  const response = await fetch(`${base}${path}`, { redirect: "manual", ...options });
  return response;
}

console.log(`Security check: ${base}`);
const baseUrl = new URL(base);
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(baseUrl.hostname);
check(baseUrl.protocol === "https:" || (isLocal && baseUrl.protocol === "http:"), "HTTPS is used outside local development");

const home = await get("/");
const headers = home.headers;
check(home.ok, "Homepage responds successfully");
check(!headers.has("x-powered-by"), "Framework disclosure header is disabled");
check(headers.get("content-security-policy")?.includes("object-src 'none'"), "CSP blocks plug-in objects");
check(headers.get("content-security-policy")?.includes("frame-ancestors 'none'"), "CSP prevents framing");
check(headers.get("content-security-policy")?.includes("form-action 'self'"), "CSP limits form destinations");
check(headers.get("x-content-type-options") === "nosniff", "MIME sniffing is disabled");
check(headers.get("x-frame-options") === "DENY", "Legacy frame protection is enabled");
check(headers.get("referrer-policy") === "strict-origin-when-cross-origin", "Referrer data is minimized cross-origin");
check(headers.get("cross-origin-opener-policy") === "same-origin", "Cross-origin opener isolation is enabled");
check(headers.get("cross-origin-resource-policy") === "same-origin", "Cross-origin resource policy is enabled");
check(headers.get("permissions-policy")?.includes("camera=()"), "Sensitive browser capabilities are disabled");
if (base.startsWith("https://")) check(Boolean(headers.get("strict-transport-security")), "HSTS is present");

for (const path of ["/privacy", "/terms", "/accessibility", "/robots.txt", "/sitemap.xml", "/.well-known/security.txt"]) {
  const response = await get(path);
  check(response.ok, `${path} is reachable`);
}

for (const path of ["/client-login", "/client-portal"]) {
  const response = await get(path);
  const cacheControl = response.headers.get("cache-control") || "";
  const robots = response.headers.get("x-robots-tag") || "";
  const cacheIsPrivate = isLocal
    ? cacheControl.includes("no-store") || cacheControl.includes("no-cache")
    : cacheControl.includes("no-store");
  check(cacheIsPrivate, `${path} is not cacheable`);
  check(robots.includes("noindex"), `${path} is excluded from indexing`);
}

const contactGet = await get("/api/contact");
check(contactGet.status === 405, "Contact API rejects unsupported methods");
check((contactGet.headers.get("cache-control") || "").includes("no-store"), "Contact API responses are not cacheable");

const securityText = await (await get("/.well-known/security.txt")).text();
check(securityText.includes("Contact: mailto:"), "Security contact is published");
check(securityText.includes("Expires:"), "Security contact has an expiry date");

if (failures.length) {
  console.error(`\n${failures.length} security check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("\nAll security checks passed.");
}
