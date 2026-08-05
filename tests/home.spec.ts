import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage presents the JZ operating group with real field proof", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Built around");
  await expect(page.locator('video source[src="/media/jz-drone-walkthrough-scrub.mp4"]')).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /Four companies.*One operating group/ })).toBeAttached();
  await expect(page.getByRole("heading", { name: /The building keeps moving.*So do we/ })).toBeAttached();
  await expect(page.getByRole("heading", { name: /Comparable work.*Clear project records/ })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Safety is part of the deliverable." })).toBeAttached();
  await expect(page.getByText("50+", { exact: true })).toBeAttached();
  await expect(page.locator(".division-stack-card")).toHaveCount(4);
  await expect(page.locator(".metric-contact .bid-form")).toHaveCount(1);
  await expect(page.locator(".metric-logo")).toHaveCount(10);

  await expect(page.getByText(/ASSETS? PENDING/i)).toHaveCount(0);
  await expect(page.getByText(/PROJECT PHOTO/i)).toHaveCount(0);
  await expect(page.getByText(/content review/i)).toHaveCount(0);

  const sectionOrder = await page.locator("main > section").evaluateAll((sections) =>
    sections.map((section) => section.id || section.className),
  );
  expect(sectionOrder.slice(0, 5)).toEqual(["top", "standard", "metric-trust", "metric-field-story", "companies"]);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await expect(page.locator(".skip-link")).toHaveAttribute("href", "#top");

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("homepage inquiry visibly routes to the selected JZ company", async ({ page }) => {
  await page.goto("/#contact");

  const form = page.locator(".metric-contact .bid-form");
  await expect(form.locator('input[name="name"]')).toBeVisible();
  await expect(form.locator('input[name="email"]')).toBeVisible();
  await expect(form.locator('input[name="projectType"]')).toBeVisible();
  await expect(form.locator('input[name="projectLocation"]')).toBeVisible();

  await form.locator('select[name="division"]').selectOption("construction");
  await expect(form.locator(".form-routing")).toContainText("JZ Construction");
  await expect(form.locator(".form-routing")).toContainText("estimating@jzconstruction.com");
  await expect(form.locator('input[name="planRoomUrl"]')).toHaveAttribute("type", "url");
});

test("project proof and safety details expand in place", async ({ page }) => {
  await page.goto("/#projects");

  const project = page.getByRole("button", { name: /Baptist Medical Arts Building/ });
  await project.click();
  await expect(page.locator(".motion-page-reveal")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("16,300 SF", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /View project details/ })).toBeVisible();
  await page.getByRole("button", { name: "Close project preview" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(project).toBeFocused();

  const safetyRecord = page.locator(".metric-qualification-list details").nth(1);
  await safetyRecord.locator("summary").click();
  await expect(safetyRecord).toHaveAttribute("open", "");
  await expect(safetyRecord.getByText(/Access, work zones, material movement/)).toBeVisible();
});

test("drone chapters and company cards follow desktop scroll progress", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop scroll choreography");
  await page.goto("/");

  const hero = page.locator(".cinematic-hero");
  const heroHeight = await hero.evaluate((element) => element.getBoundingClientRect().height);
  const viewportHeight = page.viewportSize()!.height;
  const chapterProgress = [0.17, 0.36, 0.62, 0.82];

  for (let index = 0; index < chapterProgress.length; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), (heroHeight - viewportHeight) * chapterProgress[index]);
    await page.waitForTimeout(650);
    await expect(page.locator(".hero-chapter").nth(index)).toHaveAttribute("data-active", "");
    await expect(page.locator(".hero-chapter[data-active]")).toHaveCount(1);
  }

  const stack = page.locator(".division-stack");
  const stackTop = await stack.evaluate((element) => element.getBoundingClientRect().top + scrollY);
  const stackHeight = await stack.evaluate((element) => element.getBoundingClientRect().height);
  await page.evaluate((y) => window.scrollTo(0, y), stackTop + (stackHeight - viewportHeight) * 0.88);
  await page.waitForTimeout(700);

  const visibleCards = await page.locator(".division-stack-card").evaluateAll((cards) =>
    cards.filter((card) => Number.parseFloat(getComputedStyle(card).opacity) > 0.9).length,
  );
  expect(visibleCards).toBe(4);
});

test("bid endpoint fails honestly until delivery credentials are configured", async ({ request }) => {
  const response = await request.post("/api/contact", {
    multipart: {
      name: "Estimator Test",
      email: "estimator@example.com",
      division: "demolition",
      projectType: "Selective demolition",
      projectLocation: "Miami, Florida",
      facilityStatus: "Occupied commercial facility",
      message: "Test request for the website delivery path.",
      consent: "yes",
    },
  });

  expect(response.status()).toBe(503);
  await expect(response.json()).resolves.toMatchObject({ ok: false });
});
