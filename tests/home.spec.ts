import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage presents the JZ operating group with real field proof", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Built around");
  await expect(page.locator('video source[src="/media/jz-drone-walkthrough-scrub.mp4"]')).toHaveCount(1);
  await expect(page.locator(".compact-hero-chapter")).toHaveCount(4);
  await expect(page.locator(".compact-hero-resolution img")).toHaveCount(1);
  await expect(page.locator(".compact-hero-resolution p, .compact-hero-resolution i")).toHaveCount(0);
  await expect(page.locator("#division-stack-title")).toHaveText("Four companies one operating group");
  await expect(page.locator("#field-title")).toHaveText("The building keeps moving so do we");
  await expect(page.locator("#projects-title")).toHaveText("Comparable work clear project records");
  await expect(page.getByRole("heading", { name: "Safety is part of the deliverable" })).toBeAttached();
  await expect(page.getByText("50+", { exact: true })).toBeAttached();
  await expect(page.locator(".division-stack-card")).toHaveCount(4);
  await expect(page.locator(".metric-contact .bid-form")).toHaveCount(1);
  await expect(page.locator(".metric-logo")).toHaveCount(10);

  await expect(page.getByText(/ASSETS? PENDING/i)).toHaveCount(0);
  await expect(page.getByText(/PROJECT PHOTO/i)).toHaveCount(0);
  await expect(page.getByText(/content review/i)).toHaveCount(0);
  await expect(page.locator(".section-index, .compact-hero-intro > p")).toHaveCount(0);

  const headingCopy = await page.locator("main h1, main h2").allTextContents();
  expect(headingCopy.every((heading) => !heading.includes("."))).toBe(true);
  await expect(page.locator("main h1 br, main h2 br")).toHaveCount(0);

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

test("mobile presentation copy is centered while form fields stay scannable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout only");
  await page.goto("/");

  for (const selector of [
    ".compact-hero-intro",
    ".compact-hero-chapter-content",
    ".metric-statement",
    ".metric-field-copy",
    ".division-stack-heading",
    ".metric-projects .metric-section-header",
    ".metric-contact-intro",
  ]) {
    const alignment = await page.locator(selector).first().evaluate((element) => getComputedStyle(element).textAlign);
    expect(alignment, `${selector} should use the centered mobile hierarchy`).toBe("center");
  }

  const formAlignment = await page.locator(".bid-form label").first().evaluate((element) => getComputedStyle(element).textAlign);
  expect(["left", "start"]).toContain(formAlignment);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  for (const selector of [
    ".compact-hero-summary",
    ".metric-statement-grid > div",
    ".metric-statement-grid .metric-text-link",
    ".metric-proof > header h2",
    ".metric-section-header h2",
    ".metric-section-header .metric-text-link",
  ]) {
    const center = await page.locator(selector).first().evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.left + bounds.width / 2;
    });
    expect(Math.abs(center - page.viewportSize()!.width / 2), `${selector} should sit on the page center`).toBeLessThan(2);
  }
});

test("hero tells four phases at a deliberate scroll pace", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop scroll choreography");
  await page.goto("/");

  const viewportHeight = page.viewportSize()!.height;
  const hero = page.locator(".compact-hero");
  const heroHeight = await hero.evaluate((element) => element.getBoundingClientRect().height);
  expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight * 2.15);
  expect(heroHeight).toBeLessThanOrEqual(viewportHeight * 2.2 + 2);

  const travel = heroHeight - viewportHeight;
  const checkpoints = [0.08, 0.32, 0.6, 0.8];

  for (let index = 0; index < checkpoints.length; index += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), travel * checkpoints[index]);
    await page.waitForTimeout(180);
    await expect(page.locator(".compact-hero-chapter").nth(index)).toHaveAttribute("data-active", "");
    await expect(page.locator(".compact-hero-chapter[data-active]")).toHaveCount(1);

    const activeCard = await page.locator(".compact-hero-chapter[data-active]").evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const surface = element.querySelector<HTMLElement>(".compact-hero-chapter-surface");
      return {
        centerX: bounds.left + bounds.width / 2,
        centerY: bounds.top + bounds.height / 2,
        background: surface ? getComputedStyle(surface).backgroundColor : "missing",
      };
    });
    expect(Math.abs(activeCard.centerX - page.viewportSize()!.width / 2)).toBeLessThan(2);
    expect(Math.abs(activeCard.centerY - viewportHeight / 2)).toBeLessThan(2);
    expect(activeCard.background).toBe("rgba(0, 0, 0, 0)");
  }

  await page.evaluate((y) => window.scrollTo(0, y), travel * 0.96);
  await page.waitForTimeout(260);
  await expect(page.locator(".compact-hero-resolution")).toHaveCSS("opacity", "1");
});

test("jump scrolling and anchor navigation never produce an empty viewport", async ({ page }) => {
  await page.goto("/");

  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const progress of [0.28, 0.56, 0.84]) {
    await page.evaluate((y) => window.scrollTo(0, y), maxScroll * progress);
    await page.waitForTimeout(120);

    const visibleContent = await page.locator("main h1, main h2, main h3, main p, main a, main img").evaluateAll((elements) =>
      elements.filter((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= innerHeight || bounds.width <= 0 || bounds.height <= 0) return false;

        let current: Element | null = element;
        while (current) {
          const style = getComputedStyle(current);
          if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
          current = current.parentElement;
        }
        return true;
      }).length,
    );

    expect(visibleContent).toBeGreaterThan(0);
  }

  for (const target of ["standard", "companies", "projects", "contact"]) {
    await page.goto(`/#${target}`);
    await page.waitForTimeout(120);
    await expect(page.locator(`#${target}`)).toBeInViewport();
  }
});

test("homepage content remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".compact-hero-chapter")).toHaveCount(4);
  await expect(page.locator(".compact-hero-chapter").first()).toBeVisible();
  await expect(page.locator(".division-stack-card")).toHaveCount(4);
  await expect(page.locator(".division-stack-card").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /One standard.*across every handoff/ })).toBeVisible();
  await expect(page.locator(".metric-logo")).toHaveCount(10);

  const unavailableSections = await page.locator("main > section").evaluateAll((sections) =>
    sections.filter((section) => {
      const style = getComputedStyle(section);
      const bounds = section.getBoundingClientRect();
      return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || bounds.height === 0;
    }).map((section) => section.id || section.className),
  );
  expect(unavailableSections).toEqual([]);

  await context.close();
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
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("16,300 SF", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /View project details/ })).toBeVisible();
  await page.getByRole("button", { name: "Close project preview" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  const safetyRecord = page.locator(".metric-qualification-list details").nth(1);
  await safetyRecord.locator("summary").click();
  await expect(safetyRecord).toHaveAttribute("open", "");
  await expect(safetyRecord.getByText(/Access, work zones, material movement/)).toBeVisible();
});

test("company sequence reveals from blank and opens into four columns", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop scroll choreography");
  await page.goto("/#companies");

  const viewportHeight = page.viewportSize()!.height;
  const section = page.locator(".division-stack");
  const heading = page.locator(".division-stack-heading");
  const cards = page.locator(".division-stack-card");
  const progressTrack = page.locator(".division-stack-progress");
  const sectionHeight = await section.evaluate((element) => element.getBoundingClientRect().height);
  expect(sectionHeight).toBeLessThanOrEqual(viewportHeight * 1.8 + 2);

  await expect(heading).toHaveCSS("opacity", "0");
  await expect(cards.first()).toHaveCSS("opacity", "0");
  await expect(progressTrack).toHaveCSS("opacity", "0");

  const sectionTop = await section.evaluate((element) => element.offsetTop);
  const travel = sectionHeight - viewportHeight;

  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + travel * 0.2);
  await page.waitForTimeout(500);
  await expect(heading).toHaveCSS("opacity", "1");
  await expect(cards.first()).toHaveCSS("opacity", "0");
  await expect(progressTrack).toHaveCSS("opacity", "1");

  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + travel * 0.4);
  await page.waitForTimeout(500);
  expect(Number(await cards.first().evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.95);

  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + travel * 0.98);
  await page.waitForTimeout(500);

  await expect(cards).toHaveCount(4);
  const positions = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return { left: Math.round(bounds.left), opacity: Number(getComputedStyle(element).opacity) };
    }),
  );

  expect(positions.every((position) => position.opacity > 0.95)).toBe(true);
  expect(new Set(positions.map((position) => position.left)).size).toBe(4);
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
