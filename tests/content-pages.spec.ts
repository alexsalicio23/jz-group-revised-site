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
    await expect(page.locator(".content-jump-nav")).toBeVisible();
    await expect(page.locator(".content-footer")).toBeVisible();

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

test("contact intake marks required fields and keeps a direct fallback visible", async ({ page }) => {
  await page.goto("/contact");

  for (const label of ["Name", "Work email", "Service lane", "Project type", "Location", "Facility status", "Project details"]) {
    const fieldLabel = page.locator(".bid-form label").filter({ hasText: label }).first();
    await expect(fieldLabel).toContainText("required");
  }

  await expect(page.getByRole("link", { name: "(305) 793-2984" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "estimating@jzdemo.com" }).first()).toBeVisible();
});
