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
    await expect(page.locator(".section-index:visible, .eyebrow:visible")).toHaveCount(0);

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

test("related capabilities keep actions contained and support keyboard navigation", async ({ page }) => {
  await page.goto("/demolition/services/interior-demolition");
  const related = page.locator(".metric-related .metric-content-card");
  await related.first().scrollIntoViewIfNeeded();

  expect(await related.count()).toBeGreaterThan(1);
  for (const card of await related.all()) {
    const dimensions = await card.evaluate((element) => {
      const circle = element.querySelector(".motion-action-circle");
      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        circleInside: Boolean(circle && circle.getBoundingClientRect().right <= element.getBoundingClientRect().right),
      };
    });
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
    expect(dimensions.circleInside).toBe(true);
  }

  await related.first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demolition\/services\/total-demolition/);
});

test("reduced motion skips the circular navigation transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demolition/services/interior-demolition");
  const related = page.locator(".metric-related .metric-content-card").first();
  await related.scrollIntoViewIfNeeded();
  await related.click();
  await expect(page).toHaveURL(/\/demolition\/services\/total-demolition/);
  await expect(page.locator(".motion-page-reveal")).toBeHidden();
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
