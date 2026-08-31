import { expect, test } from "@playwright/test";
import { getSiteUrl } from "../app/site-url";

// Read the canonical host from the app instead of hard-coding it. These
// assertions still named jzdemo.com after the site moved to
// www.jzgroupmiami.com, so they failed on every run.
const SITE = getSiteUrl();

const divisions = ["demolition", "construction", "waste-management", "development"] as const;

test("public company pages expose production canonicals and unique social cards", async ({ page }) => {
  const socialCards: Array<{ title: string | null; description: string | null; image: string | null }> = [];

  for (const division of divisions) {
    await page.goto(`/${division}`);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex|nofollow/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/${division}`);

    socialCards.push({
      title: await page.locator('meta[property="og:title"]').getAttribute("content"),
      description: await page.locator('meta[property="og:description"]').getAttribute("content"),
      image: await page.locator('meta[property="og:image"]').getAttribute("content"),
    });
  }

  expect(new Set(socialCards.map((card) => card.title)).size).toBe(divisions.length);
  expect(new Set(socialCards.map((card) => card.description)).size).toBe(divisions.length);
  expect(new Set(socialCards.map((card) => card.image)).size).toBe(divisions.length);
});

test("sitemap, structured data, caching, and security headers are launch ready", async ({ page, request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  for (const division of divisions) expect(sitemap).toContain(`${SITE}/${division}`);
  expect(sitemap).toContain(`${SITE}/demolition/services/interior-demolition`);

  const deepPageResponse = await request.get("/demolition/services/interior-demolition", { maxRedirects: 0 });
  expect(deepPageResponse.status()).toBe(200);
  await page.goto("/demolition/services/interior-demolition");
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex|nofollow/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${SITE}/demolition/services/interior-demolition`,
  );

  await page.goto("/demolition");
  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((elements) =>
    elements.map((element) => JSON.parse(element.textContent || "{}")),
  );
  const graphItems = schemas.flatMap((schema) => schema["@graph"] || [schema]);
  expect(graphItems.some((item) => item["@type"] === "LocalBusiness")).toBe(true);
  expect(graphItems.some((item) => item["@type"] === "Service")).toBe(true);
  expect(graphItems.some((item) => item["@type"] === "BreadcrumbList")).toBe(true);

  const homeResponse = await request.get("/");
  expect(homeResponse.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(homeResponse.headers()["x-content-type-options"]).toBe("nosniff");
  expect(homeResponse.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(homeResponse.headers()["permissions-policy"]).toContain("camera=()");
  expect(homeResponse.headers()["cross-origin-opener-policy"]).toBe("same-origin");
  expect(homeResponse.headers()["cross-origin-resource-policy"]).toBe("same-origin");
  expect(homeResponse.headers()["x-permitted-cross-domain-policies"]).toBe("none");

  const mediaResponse = await request.get("/media/jz-drone-walkthrough.mp4");
  expect(mediaResponse.headers()["cache-control"]).toContain("max-age=31536000");
  expect(mediaResponse.headers()["cache-control"]).toContain("immutable");
});

test("privacy endpoints and private-route controls remain available", async ({ page, request }) => {
  for (const route of ["/privacy", "/terms", "/accessibility"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".jz-site-footer-meta").getByRole("link", { name: "Privacy" })).toBeVisible();
  }

  const security = await request.get("/.well-known/security.txt");
  expect(security.status()).toBe(200);
  expect(await security.text()).toContain("Contact: mailto:");

  for (const route of ["/client-login", "/client-portal"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  }
});
