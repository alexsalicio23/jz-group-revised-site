import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = {
  demolition: ["/", "/services/interior-demolition", "/services/total-demolition", "/services/concrete-work", "/projects", "/projects/healthcare", "/about", "/projects/retail-entertainment", "/projects/business-community", "/services/waste-hauling", "/projects/education", "/contact?for=demolition"],
  construction: ["/", "/services/general-contracting", "/services/subcontracting", "/projects", "/projects/commercial", "/about", "/projects/healthcare", "/contact?for=construction"],
  "waste-management": ["/", "/services/dumpster-rentals", "/services/temporary-fencing", "/services/general-labor", "/services/recycling", "/about", "/contact?for=waste-management"],
  development: ["/", "/projects", "/about", "/contact?for=development"],
} as const;

const company = process.env.NEXT_PUBLIC_COMPANY_SITE as keyof typeof routes | undefined;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/contact", (route) => route.abort("blockedbyclient"));
});

for (const path of company && company in routes ? [...routes[company], "/privacy"] : []) {
  test(`${company} ${path} preserves visible content bounds and shared branding`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const clippedHeadings = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((headings) => {
      const failures: string[] = [];
      for (const heading of headings) {
        const bounds = heading.getBoundingClientRect();
        if (!bounds.width || !bounds.height || getComputedStyle(heading).visibility === "hidden") continue;
        const range = document.createRange();
        range.selectNodeContents(heading);
        const fragments = [...range.getClientRects()].filter((rect) => rect.width && rect.height);
        for (const rect of fragments) {
          if (rect.left < bounds.left - 2 || rect.right > bounds.right + 2 || rect.left < -2 || rect.right > innerWidth + 2) {
            failures.push(`${heading.textContent?.trim()}: text escapes heading or viewport`);
            break;
          }
          for (let parent = heading.parentElement; parent; parent = parent.parentElement) {
            const style = getComputedStyle(parent);
            const clipX = /hidden|clip|auto|scroll/.test(style.overflowX);
            const clipY = /hidden|clip/.test(style.overflowY);
            const parentBounds = parent.getBoundingClientRect();
            if ((clipX && (rect.left < parentBounds.left - 2 || rect.right > parentBounds.right + 2)) || (clipY && (rect.top < parentBounds.top - 2 || rect.bottom > parentBounds.bottom + 2))) {
              failures.push(`${heading.textContent?.trim()}: clipped by ${parent.className || parent.tagName}`);
              break;
            }
          }
        }
      }
      return [...new Set(failures)];
    });
    expect(clippedHeadings).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

    const logos = page.locator('img[src*="brand-logo"]');
    expect(await logos.count()).toBeGreaterThan(0);
    for (const logo of await logos.all()) await expect(logo).toHaveCSS("filter", "none");
    const footer = page.locator(".jz-site-footer");
    await expect(footer).toContainText("14605 Harris Pl");
    await expect(footer.locator('a[href="/privacy"]')).toHaveCount(1);
    await expect(footer.locator(".jz-site-footer-social a")).toHaveCount(0);
    await expect(footer.locator(".jz-site-footer-location")).toHaveAttribute("href", /maps|google/i);

    if (process.env.NEXT_PUBLIC_NO_INDEX === "1") {
      expect(response?.headers()["x-robots-tag"]).toContain("noindex");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }

    await page.screenshot({ path: testInfo.outputPath("top.png") });
    const related = page.locator(".metric-related:not(.has-media-cards)");
    if (await related.count()) {
      const box = await related.boundingBox();
      expect(box?.height ?? 0).toBeLessThan(testInfo.project.name === "desktop" ? 650 : 750);
      await related.screenshot({ path: testInfo.outputPath("related.png") });
    }
    for (const asset of await page.locator("main img").all()) {
      if (!await asset.isVisible()) continue;
      await asset.scrollIntoViewIfNeeded();
      await expect.poll(() => asset.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("company header subtitle remains readable after scrolling", async ({ page }, testInfo) => {
  test.skip(!company || testInfo.project.name !== "desktop", "Standalone desktop header");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(page.locator(".template-header")).toHaveAttribute("data-scrolled", "true");
  await expect(page.locator(".template-brand small")).toHaveCSS("font-size", "12px");
  const results = await new AxeBuilder({ page }).include(".template-header").analyze();
  expect(results.violations).toEqual([]);
});

test("audited long headings fit narrower and wider phones", async ({ page }, testInfo) => {
  const regressionRoutes = company === "construction"
    ? ["/services/general-contracting", "/services/subcontracting", "/projects", "/projects/commercial", "/projects/healthcare", "/contact?for=construction"]
    : company === "waste-management" ? ["/services/recycling"] : [];
  test.skip(!regressionRoutes.length || testInfo.project.name !== "mobile", "Mobile clipping regression routes only");
  for (const width of [320, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of regressionRoutes) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const escapedText = await page.locator("main h1, .metric-content-section h2").evaluateAll((headings) => headings.flatMap((heading) => {
        const bounds = heading.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(heading);
        return [...range.getClientRects()].some((rect) => rect.left < bounds.left - 2 || rect.right > bounds.right + 2)
          ? [heading.textContent] : [];
      }));
      expect(escapedText, `${width}px ${path}`).toEqual([]);
    }
  }
});

test("company background controls have a clear slot beside visible content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const controlRoutes = company ? ["/"] : Object.keys(routes).map((slug) => `/templates/${slug}`);
  for (const path of controlRoutes) {
    await page.goto(path);
    const controls = page.locator('button[aria-controls][aria-label$="background video"]');
    await expect(controls.first()).toBeAttached();
    for (const control of await controls.all()) {
      await control.scrollIntoViewIfNeeded();
      await control.click({ trial: true });
      const overlaps = await control.evaluate((button) => {
        const bounds = button.getBoundingClientRect();
        return [...button.closest("section")!.querySelectorAll("h1, h2, p, dl, a")].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width && rect.height && Math.min(bounds.right, rect.right) - Math.max(bounds.left, rect.left) > 1
            && Math.min(bounds.bottom, rect.bottom) - Math.max(bounds.top, rect.top) > 1;
        }).map((element) => element.textContent?.trim());
      });
      expect(overlaps, path).toEqual([]);
    }
  }
});
