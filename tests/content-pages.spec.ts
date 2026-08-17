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
    const headingStyles = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((headings) =>
      headings.map((heading) => ({
        letterSpacing: getComputedStyle(heading).letterSpacing,
        textTransform: getComputedStyle(heading).textTransform,
      })),
    );
    expect(headingStyles.every((style) => style.textTransform === "uppercase")).toBe(true);
    expect(headingStyles.every((style) => ["normal", "0px"].includes(style.letterSpacing))).toBe(true);

    const supportAlignment = await page.locator(
      ".metric-content-hero-bottom > p, .metric-content-body > p, .metric-content-card p, .metric-spec-grid article > p",
    ).evaluateAll((elements) => elements.map((element) => getComputedStyle(element).textAlign));
    expect(supportAlignment.length).toBeGreaterThan(0);
    expect(supportAlignment.every((alignment) => alignment === "center")).toBe(true);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("about page presents the approved team roster in order", async ({ page }) => {
  await page.goto("/about");

  const expectedNames = [
    "Alex DeArmas",
    "Zeniada Balseiro",
    "Chris Carter",
    "Juan Machado",
    "Robert Rey",
    "Franja DeArmas",
    "Henry Monterrey",
    "Yacel Frontela",
    "Miguel Munoz",
    "Alejandro Osorio",
    "Freddy Oleva",
    "Lazaro Pérez",
    "Yunier Fernandez",
  ];

  await expect(page.locator(".team-card")).toHaveCount(expectedNames.length);
  expect(await page.locator(".team-card h3").allTextContents()).toEqual(expectedNames);
  await expect(page.locator(".team-card img")).toHaveCount(4);
  await expect(page.locator(".team-card-initials")).toHaveCount(9);
});

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

test("supplied field photography follows the service context", async ({ page }) => {
  await page.goto("/safety");
  await expect(page.locator('.metric-content-hero-media img[src*="safety-containment.webp"]')).toBeVisible();
  await expect(page.locator('.metric-content-media img[src*="safety-air-control.webp"]')).toBeVisible();

  await page.goto("/demolition/services/interior-demolition");
  await expect(page.locator('.metric-content-media img[src*="mob-pompano-demolition.webp"]')).toBeVisible();

  await page.goto("/construction/services/general-contracting");
  await expect(page.locator('.metric-content-media img[src*="division-construction.webp"]')).toBeVisible();

  await page.goto("/construction/services/subcontracting");
  await expect(page.locator('.metric-content-media img[src*="division-construction.webp"]')).toBeVisible();
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

  for (const label of ["Name", "Company", "Work email", "Service lane", "Project type", "Location", "Facility status", "Project details"]) {
    const fieldLabel = page.locator(".bid-form label").filter({ hasText: label }).first();
    await expect(fieldLabel).toContainText("required");
  }

  await expect(page.locator(".form-consent")).toContainText("required");

  await expect(page.getByRole("link", { name: "(305) 793-2984" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "estimating@jzdemo.com" }).first()).toBeVisible();
  await expect(page.locator(".bid-form")).toHaveAttribute("method", "post");
  await expect(page.locator(".bid-form")).toHaveAttribute("action", "/api/contact");
  await expect(page.locator('input[name="attachments"]')).toHaveAttribute("accept", "application/pdf,image/png,image/jpeg,image/webp");
  await expect(page.locator("#attachment-help")).toContainText("plan-room link above");
});

test("mobile form and menu controls remain readable and touch friendly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout only");
  await page.goto("/contact");

  const controlSizes = await page.locator('.bid-form input:not([type="checkbox"]), .bid-form select, .bid-form textarea').evaluateAll(
    (controls) => controls.map((control) => ({
      fontSize: Number.parseFloat(getComputedStyle(control).fontSize),
      height: control.getBoundingClientRect().height,
    })),
  );
  expect(controlSizes.every((control) => control.fontSize >= 16)).toBe(true);
  expect(controlSizes.every((control) => control.height >= 44)).toBe(true);

  const menuBounds = await page.locator(".mobile-menu summary, .template-mobile-menu summary").first().evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  });
  expect(menuBounds.width).toBeGreaterThanOrEqual(44);
  expect(menuBounds.height).toBeGreaterThanOrEqual(44);

  const contactCardsFit = await page.locator(".metric-content-card-grid").first().evaluate((grid) => {
    const bounds = grid.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= window.innerWidth;
  });
  expect(contactCardsFit).toBe(true);

  await page.goto("/about");
  const teamColumnCount = await page.locator(".team-grid").first().evaluate((grid) =>
    getComputedStyle(grid).gridTemplateColumns.split(" ").length,
  );
  expect(teamColumnCount).toBe(2);
});
