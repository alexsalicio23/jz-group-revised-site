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
  await expect(page.locator("video")).toHaveCount(1);
  await expect(page.locator('video source[src="/media/jz-drone-walkthrough.mp4"]')).toHaveCount(1);
  await expect(page.locator('video source[src="/media/jz-drone-walkthrough-scrub.mp4"]')).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /Four companies.*One operating group/ })).toBeAttached();
  await expect(page.getByText("Controlled demolition", { exact: true })).toBeAttached();
  await expect(page.getByText("Drywall and ceiling systems", { exact: true })).toBeAttached();
  await expect(page.locator(".hero-resolution-title")).toContainText("One group.");
  await expect(page.locator(".hero-resolution-logo")).toHaveAttribute("alt", "JZ Group");
  await expect(page.locator(".cinematic-hero .eyebrow")).toHaveCount(0);
  await expect(page.locator(".division-stack-heading p")).toHaveCount(0);
  await expect(page.locator(".division-heading-line")).toHaveCount(2);
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
    const [stackHeight, viewportHeight] = await Promise.all([
      page.locator(".division-stack").evaluate((element) => element.getBoundingClientRect().height),
      page.evaluate(() => window.innerHeight),
    ]);
    expect(stackHeight).toBeGreaterThanOrEqual(viewportHeight * 2.95);
    expect(stackHeight).toBeLessThanOrEqual(viewportHeight * 3.05);
    await expect(page.locator(".division-stack-card")).toHaveCount(4);
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

test("desktop hero chapters occupy distinct quadrants and reverse cleanly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop-only hero choreography");
  await page.goto("/");

  const checkpoints = [
    { progress: 0.18, motion: "cut", horizontal: "left", vertical: "lower" },
    { progress: 0.36, motion: "frame", horizontal: "right", vertical: "upper" },
    { progress: 0.6, motion: "panels", horizontal: "left", vertical: "upper" },
    { progress: 0.82, motion: "complete", horizontal: "right", vertical: "lower" },
  ] as const;

  for (const checkpoint of checkpoints) {
    await page.evaluate((progress) => {
      document.documentElement.style.scrollBehavior = "auto";
      const hero = document.querySelector<HTMLElement>(".cinematic-hero");
      const travel = Math.max(0, (hero?.offsetHeight ?? 0) - window.innerHeight);
      window.scrollTo(0, travel * progress);
    }, checkpoint.progress);

    const activeCard = page.locator(`[data-motion="${checkpoint.motion}"]`);
    await expect.poll(() => activeCard.getAttribute("data-active")).toBe("");
    await expect.poll(() => activeCard.evaluate((card) => Number(getComputedStyle(card).opacity))).toBeGreaterThan(0.98);

    const layout = await activeCard.evaluate((card) => {
      const bounds = card.getBoundingClientRect();
      return {
        centerX: bounds.left + bounds.width / 2,
        centerY: bounds.top + bounds.height / 2,
        width: bounds.width,
        top: bounds.top,
        bottom: bounds.bottom,
        titleSize: Number.parseFloat(getComputedStyle(card.querySelector("h2")!).fontSize),
        bodySize: Number.parseFloat(getComputedStyle(card.querySelector("p")!).fontSize),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    });

    expect(checkpoint.horizontal === "left" ? layout.centerX < layout.viewportWidth / 2 : layout.centerX > layout.viewportWidth / 2).toBe(true);
    expect(checkpoint.vertical === "upper" ? layout.centerY < layout.viewportHeight / 2 : layout.centerY > layout.viewportHeight / 2).toBe(true);
    expect(layout.top).toBeGreaterThan(90);
    expect(layout.bottom).toBeLessThan(layout.viewportHeight - 70);
    expect(layout.width).toBeGreaterThan(600);
    expect(layout.titleSize).toBeGreaterThanOrEqual(62);
    expect(layout.bodySize).toBeGreaterThanOrEqual(19);

    const chapterState = await page.locator(".hero-chapter").evaluateAll((cards) => ({
      active: cards.filter((card) => card.hasAttribute("data-active")).length,
      fullyVisible: cards.filter((card) => Number(getComputedStyle(card).opacity) > 0.98).length,
      blockedInactive: cards
        .filter((card) => !card.hasAttribute("data-active"))
        .every((card) => getComputedStyle(card).pointerEvents === "none"),
    }));
    expect(chapterState).toEqual({ active: 1, fullyVisible: 1, blockedInactive: true });
  }

  const completeCard = page.locator('[data-motion="complete"]');
  const completeBounds = await completeCard.boundingBox();
  expect(completeBounds).not.toBeNull();
  await page.mouse.move(
    (completeBounds?.x ?? 0) + (completeBounds?.width ?? 0) - 8,
    (completeBounds?.y ?? 0) + 12,
  );
  await expect.poll(() => completeCard.locator(".hero-chapter-interactive").evaluate(
    (card) => getComputedStyle(card).getPropertyValue("--pointer-x").trim(),
  )).not.toBe("0px");
  await page.mouse.move(8, 8);
  await expect.poll(() => completeCard.locator(".hero-chapter-interactive").evaluate(
    (card) => getComputedStyle(card).getPropertyValue("--pointer-x").trim(),
  )).toBe("0px");

  await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>(".cinematic-hero");
    const travel = Math.max(0, (hero?.offsetHeight ?? 0) - window.innerHeight);
    window.scrollTo(0, travel * 0.34);
  });
  await expect.poll(() => page.locator('[data-motion="frame"]').getAttribute("data-active")).toBe("");
  await expect.poll(() => page.locator('[data-motion="frame"]').evaluate(
    (card) => Number(getComputedStyle(card).opacity),
  )).toBeGreaterThan(0.98);

  const drywallRails = await page.locator('[data-motion="panels"]').evaluate((card) => ({
    cardHeight: card.getBoundingClientRect().height,
    bottomRailHeight: card.querySelector(".hero-chapter-rail-bottom")?.getBoundingClientRect().height,
    topRailHeight: card.querySelector(".hero-chapter-rail-top")?.getBoundingClientRect().height,
  }));
  expect(drywallRails.topRailHeight).toBeLessThanOrEqual(10);
  expect(drywallRails.bottomRailHeight).toBeLessThanOrEqual(10);
  expect(drywallRails.cardHeight).toBeGreaterThan(250);
});

test("hero logo resolves cleanly into the animated division system", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop-only hero handoff");
  await page.goto("/");

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const hero = document.querySelector<HTMLElement>(".cinematic-hero");
    const travel = Math.max(0, (hero?.offsetHeight ?? 0) - window.innerHeight);
    window.scrollTo(0, travel * 0.975);
  });

  await expect.poll(() => page.locator(".hero-resolution").evaluate(
    (element) => Number(getComputedStyle(element).opacity),
  )).toBeGreaterThan(0.98);
  await expect.poll(() => page.locator(".hero-resolution-logo").evaluate(
    (element) => Number(getComputedStyle(element).opacity),
  )).toBeGreaterThan(0.98);

  const resolutionState = await page.locator(".hero-resolution-lockup").evaluate((lockup) => {
    const bounds = lockup.getBoundingClientRect();
    const visibleCards = [...document.querySelectorAll(".hero-chapter")].filter(
      (card) => Number(getComputedStyle(card).opacity) > 0.02,
    ).length;
    return {
      centerX: bounds.left + bounds.width / 2,
      centerY: bounds.top + bounds.height / 2,
      visibleCards,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
    };
  });
  expect(Math.abs(resolutionState.centerX - resolutionState.viewportWidth / 2)).toBeLessThan(4);
  expect(Math.abs(resolutionState.centerY - resolutionState.viewportHeight / 2)).toBeLessThan(55);
  expect(resolutionState.visibleCards).toBe(0);

  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".division-stack");
    if (!section) return;
    const top = section.getBoundingClientRect().top + scrollY;
    const travel = Math.max(0, section.offsetHeight - innerHeight);
    window.scrollTo(0, top + travel * 0.12);
  });
  await expect.poll(() => page.locator(".division-heading-line").first().evaluate(
    (line) => Number(getComputedStyle(line.firstElementChild!).opacity),
  )).toBeGreaterThan(0.95);

  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".division-stack");
    if (!section) return;
    const top = section.getBoundingClientRect().top + scrollY;
    const travel = Math.max(0, section.offsetHeight - innerHeight);
    window.scrollTo(0, top + travel * 0.9);
  });
  await expect.poll(() => page.locator(".division-stack-card").evaluateAll(
    (cards) => cards.every((card) => Number(getComputedStyle(card).opacity) > 0.98),
  )).toBe(true);
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
