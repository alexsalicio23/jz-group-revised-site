import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("opens cinematically, then moves quickly into the JZ Group system", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Specialty demolition in active environments",
  );

  const sectionOrder = await page.locator("main > section").evaluateAll((sections) =>
    sections.map((section) => section.id || section.className),
  );
  expect(sectionOrder.slice(0, 5)).toEqual(["top", "group", "experience", "expertise", "projects"]);
  await expect(page.locator("video")).toHaveCount(3);
  await expect(page.locator('video source[src="/media/jz-drone-walkthrough.mp4"]')).toHaveCount(1);
  await expect(page.locator('video source[src="/media/jz-drone-walkthrough-scrub.mp4"]')).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /Four companies.*One operating group/ })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Comparable work." })).toBeAttached();
  await expect(page.getByText("50+", { exact: true })).toBeAttached();
  await expect(page.locator("main > .contact .bid-form")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Contact estimating/ })).toHaveCount(
    testInfo.project.name === "mobile" ? 1 : 2,
  );
  await expect(page.getByRole("link", { name: "(305) 793-2984" })).toHaveCount(
    testInfo.project.name === "mobile" ? 1 : 2,
  );

  await expect(page.getByText(/ASSETS? PENDING/i)).toHaveCount(0);
  await expect(page.getByText(/PROJECT PHOTO/i)).toHaveCount(0);
  await expect(page.getByText(/content review/i)).toHaveCount(0);
  await expect(page.locator(".client-logo")).toHaveCount(10);

  await expect(page.getByText("Access granted", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Control the cut", { exact: false })).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);

  if (testInfo.project.name === "desktop") {
    const chainHeight = await page.locator(".chain").evaluate((element) => element.getBoundingClientRect().height);
    expect(chainHeight).toBeLessThanOrEqual(900 * 2.05);
  }

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-hero.png`),
    fullPage: false,
  });
});

test("project proof and safety details expand in place", async ({ page }) => {
  await page.goto("/#projects");

  const project = page.getByRole("button", { name: /Baptist Medical Arts Building/ });
  await project.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("img")).toHaveCount(1);
  await expect(page.getByText("16,300 SF", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /View project details/ })).toBeVisible();
  await expect(page.getByRole("dialog").getByText(/ASSETS? PENDING/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Close project preview" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  const safetyRecord = page.locator(".qualification-list details").first();
  await safetyRecord.locator("summary").click();
  await expect(safetyRecord).toHaveAttribute("open", "");
  await expect(safetyRecord.getByText(/facilities, people, and systems/)).toBeVisible();
});

test("walkthrough advances through the hero on desktop and mobile", async ({ page }, testInfo) => {
  await page.goto("/");
  const walkthrough = page.locator(".hero-walkthrough");

  await expect.poll(() => walkthrough.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(1);

  if (testInfo.project.name === "mobile") {
    await expect.poll(() => walkthrough.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain(
      "/media/jz-drone-walkthrough.mp4",
    );
    await expect.poll(() => walkthrough.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(2.1);
    return;
  }

  await expect.poll(() => walkthrough.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain(
    "/media/jz-drone-walkthrough-scrub.mp4",
  );
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const hero = document.querySelector<HTMLElement>(".cinematic-hero");
    const scrollDistance = Math.max(0, (hero?.offsetHeight ?? 0) - window.innerHeight);
    window.scrollTo(0, scrollDistance * 0.72);
  });
  await expect.poll(() => walkthrough.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(8);
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
