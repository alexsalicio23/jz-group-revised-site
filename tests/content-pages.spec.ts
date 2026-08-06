import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicContentRoutes } from "../app/content-data";

test("every public company, service, and project page is reachable", async ({ request }) => {
  for (const route of publicContentRoutes) {
    const response = await request.get(route);
    expect(response.status(), `${route} should return 200`).toBe(200);
    const html = await response.text();
    expect(html, `${route} should contain its content page`).toContain("content-page");
  }
});

const representativePages = [
  "/about",
  "/demolition/services/interior-demolition",
  "/waste-management/services/dumpster-rentals",
  "/construction/projects/healthcare",
  "/development/projects",
];

for (const route of representativePages) {
  test(`${route} is readable and accessible`, async ({ page }) => {
    await page.goto(route);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".metric-content-hero-media")).toBeVisible();
    await expect(page.locator(".metric-subpage-footer")).toBeVisible();
    await expect(page.getByText(/ASSETS? PENDING/i)).toHaveCount(0);
    await expect(page.locator(".section-index")).toHaveCount(0);

    const headingCopy = await page.locator("main h1, main h2, main h3, main h4").allTextContents();
    expect(headingCopy.every((heading) => !heading.includes("."))).toBe(true);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("division service links lead into the detailed route system", async ({ page }) => {
  await page.goto("/demolition");
  expect(await page.locator('a[href="/demolition/services/interior-demolition"]').count()).toBeGreaterThan(0);

  await page.goto("/waste-management");
  expect(await page.locator('a[href="/waste-management/services/dumpster-rentals"]').count()).toBeGreaterThan(0);

  await page.goto("/construction");
  expect(await page.locator('a[href="/construction/services/general-contracting"]').count()).toBeGreaterThan(0);

  await page.goto("/development");
  expect(await page.locator('a[href="/development/projects"]').count()).toBeGreaterThan(0);
});

test("mobile division and service pages preserve the centered hierarchy", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout only");

  await page.goto("/demolition");
  await expect(page.locator(".metric-division-hero-copy")).toHaveCSS("text-align", "center");
  await expect(page.locator(".metric-division-intro")).toHaveCSS("text-align", "center");
  const cueCenter = await page.locator(".metric-scroll-cue").evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.left + bounds.width / 2;
  });
  expect(Math.abs(cueCenter - page.viewportSize()!.width / 2)).toBeLessThan(2);

  await page.goto("/demolition/services/interior-demolition");
  await expect(page.locator(".metric-content-hero-copy")).toHaveCSS("text-align", "center");
  await expect(page.locator(".metric-content-section > header").first()).toHaveCSS("text-align", "center");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("contact intake marks required fields and keeps a direct fallback visible", async ({ page }) => {
  await page.goto("/contact");

  for (const label of ["Name", "Work email", "Service lane", "Project type", "Location", "Facility status", "Project details"]) {
    const fieldLabel = page.locator(".bid-form label").filter({ hasText: label }).first();
    await expect(fieldLabel).toContainText("required");
  }

  await expect(page.getByRole("link", { name: "(305) 793-2984" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "estimating@jzdemo.com" }).first()).toBeVisible();
});
