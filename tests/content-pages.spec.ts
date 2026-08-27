import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicContentRoutes } from "../app/content-data";

const groupContentRoutes = publicContentRoutes.filter((route) => !/^\/(demolition|construction|waste-management|development)\//.test(route));

test("every public JZ Group content page is reachable", async ({ request }) => {
  for (const route of groupContentRoutes) {
    const response = await request.get(route);
    expect(response.status(), `${route} should return 200`).toBe(200);
    const html = await response.text();
    expect(html, `${route} should contain its content page`).toContain("content-page");
  }
});

const representativePages = [
  "/about",
  "/services",
  "/projects",
  "/safety",
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
    const primaryHeadingCopy = await page.locator("main h1, main h2").allTextContents();
    expect(primaryHeadingCopy.every((heading) => heading.trim().split(/\s+/).length <= 5)).toBe(true);
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
  await expect(page.locator(".team-card").first()).toBeVisible();
  expect((await page.locator(".team-card").first().boundingBox())?.height ?? 0).toBeGreaterThan(150);
  expect(await page.locator(".team-card-name").allTextContents()).toEqual(expectedNames);
  await expect(page.locator(".team-card img")).toHaveCount(8);
  await expect(page.locator(".team-card-initials")).toHaveCount(5);

  const firstProfile = page.getByRole("button", { name: "View contact details for Alex DeArmas" });
  await firstProfile.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "ALEX DEARMAS" })).toBeVisible();
  await expect(dialog.getByText("President", { exact: true })).toBeVisible();
  await expect(dialog.getByText("To be confirmed")).toHaveCount(2);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(firstProfile).toBeFocused();
});

test("division overview pages hand off to dedicated company sites", async ({ page }) => {
  const companies = [
    ["demolition", "https://jz-demolition-miami.vercel.app"],
    ["construction", "https://jz-construction-miami.vercel.app"],
    ["waste-management", "https://jz-waste-management-miami.vercel.app"],
    ["development", "https://jz-development-miami.vercel.app"],
  ] as const;

  for (const [division, site] of companies) {
    await page.goto(`/${division}`);
    await expect(page.locator(".company-overview")).toBeVisible();
    await expect(page.locator(`a[href="${site}"]`).first()).toBeVisible();
    await expect(page.locator(".company-overview-capabilities article")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  }
});

test("supplied field photography follows the service context", async ({ page }) => {
  await page.goto("/safety");
  await expect(page.locator('.metric-content-hero-media img[src*="safety-containment.webp"]')).toBeVisible();
  await expect(page.locator('.metric-content-media img[src*="safety-air-control.webp"]')).toBeVisible();
});

test("group projects page presents the project portfolio and approved Pagani photography", async ({ page }) => {
  await page.goto("/projects");

  const expectedProjects = [
    "Pagani Residence",
    "8030",
    "MHW CT1 & CT2",
    "JP Morgan Chase",
    "BHF MAP",
    "Rutledge Facade Demo",
    "Drew's Kitchen",
    "Luis Quintana House",
    "UMHT PY-B L4",
    "North Bay Village",
    "BHTP X-Ray RM 1 & 3",
    "MOB Pompano",
    "MCI Hallandale",
    "100 Biscayne",
    "JDCH CT Scan",
    "CCOC Vault Expansion",
    "MHW Cath Lab",
    "UMHT Penthouse",
    "UMHT OR Reno",
    "CSPD Phase 2",
    "UMHT Cath Lab",
    "UMHT PAC-U",
  ];

  await expect(page.locator(".portfolio-card")).toHaveCount(expectedProjects.length);
  expect(await page.locator(".portfolio-card h3").allTextContents()).toEqual(expectedProjects);
  await expect(page.locator(".portfolio-card-placeholder")).toHaveCount(expectedProjects.length - 1);
  await expect(page.locator('.portfolio-card img[src*="pagani-residence-site-work.webp"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("mobile division and service pages preserve the centered hierarchy", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout only");

  await page.goto("/demolition");
  await expect(page.locator(".company-overview-copy")).toBeVisible();
  const serviceIndexContainment = await page.locator(".company-overview-capabilities article").evaluateAll(
    (rows) => rows.map((row) => row.scrollWidth <= row.clientWidth + 1),
  );
  expect(serviceIndexContainment.every(Boolean)).toBe(true);
  const cueCenter = await page.locator(".metric-scroll-cue").evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.left + bounds.width / 2;
  });
  expect(Math.abs(cueCenter - page.viewportSize()!.width / 2)).toBeLessThan(2);

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

  await expect(page.locator(".form-consent")).toHaveCount(2);
  await expect(page.locator(".form-sensitive-data")).toContainText("patient or medical information");
  await expect(page.getByRole("link", { name: "Privacy Notice" })).toHaveAttribute("href", "/privacy");

  await expect(page.getByRole("link", { name: "(305) 793-2984" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "estimating@jzdemo.com" }).first()).toBeVisible();
  await expect(page.locator(".bid-form")).toHaveAttribute("method", "post");
  await expect(page.locator(".bid-form")).toHaveAttribute("action", "/api/contact");
  await expect(page.locator('input[name="attachments"]')).toHaveCount(0);
  await expect(page.locator("#plan-room-help")).toContainText("Send credentials separately");
});

test("mobile form and menu controls remain readable and touch friendly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout only");
  await page.goto("/contact");

  const bodyFontSize = await page.locator("body").evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(bodyFontSize).toBeGreaterThanOrEqual(16);

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

  const compactType = await page.locator(".metric-breadcrumb, .bid-form label, .metric-subpage-footer").evaluateAll(
    (elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  );
  expect(compactType.every((fontSize) => fontSize >= 12.4)).toBe(true);

  const consentBounds = await page.locator('.form-consent input[type="checkbox"]').evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    }),
  );
  expect(consentBounds).toHaveLength(2);
  expect(consentBounds.every((bounds) => bounds.width >= 24 && bounds.height >= 24)).toBe(true);

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
