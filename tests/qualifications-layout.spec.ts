import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widths = [320, 360, 375, 390, 430, 560, 760, 768, 900, 1024, 1100, 1101, 1200, 1201, 1280, 1366, 1440, 1920];

for (const width of widths) {
  test(`group qualifications fit and stay centered at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width < 761 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/api/contact", (route) => route.abort("blockedbyclient"));
    await page.goto("/#qualification-band-title");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator(".qualification-band");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Qualifications");

    const bounds = await section.evaluate((element) => {
      const sectionRect = element.getBoundingClientRect();
      const heading = element.querySelector("h2")!;
      const headingRect = heading.getBoundingClientRect();
      const headingRange = document.createRange();
      headingRange.selectNodeContents(heading);
      const headingLines = new Set([...headingRange.getClientRects()].filter((rect) => rect.width).map((rect) => Math.round(rect.top)));
      const failures: string[] = [];
      for (const copy of element.querySelectorAll("h2, p, a, dt, dd")) {
        const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (!node.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            if (!rect.width) continue;
            if (rect.left < sectionRect.left - 1 || rect.right > sectionRect.right + 1 || rect.left < 0 || rect.right > innerWidth) {
              failures.push(`${copy.tagName}: text escapes section or viewport`);
            }
            const copyBounds = copy.getBoundingClientRect();
            if (rect.left < copyBounds.left - 1 || rect.right > copyBounds.right + 1) failures.push(`${copy.tagName}: text escapes its own box`);
            for (let parent = copy.parentElement; parent; parent = parent.parentElement) {
              const style = getComputedStyle(parent);
              const parentRect = parent.getBoundingClientRect();
              if (/hidden|clip|auto|scroll/.test(style.overflowX) && (rect.left < parentRect.left - 1 || rect.right > parentRect.right + 1)) failures.push(`${copy.tagName}: clipped horizontally`);
              if (/hidden|clip/.test(style.overflowY) && (rect.top < parentRect.top - 1 || rect.bottom > parentRect.bottom + 1)) failures.push(`${copy.tagName}: clipped vertically`);
            }
          }
        }
      }
      const paragraph = element.querySelector("header p")!.getBoundingClientRect();
      return {
        failures: [...new Set(failures)],
        headingLines: headingLines.size,
        headingCenterOffset: Math.abs((headingRect.left + headingRect.right) / 2 - (sectionRect.left + sectionRect.right) / 2),
        paragraphCenterOffset: Math.abs((paragraph.left + paragraph.right) / 2 - (sectionRect.left + sectionRect.right) / 2),
        overlap: headingRange.getBoundingClientRect().bottom > paragraph.top,
      };
    });
    expect(bounds.failures).toEqual([]);
    expect(bounds.headingLines).toBe(1);
    expect(bounds.headingCenterOffset).toBeLessThan(2);
    expect(bounds.paragraphCenterOffset).toBeLessThan(2);
    expect(bounds.overlap).toBe(false);
    await section.screenshot({ path: testInfo.outputPath(`qualifications-${width}.png`) });
    if (width === 390 || width === 1440) {
      const accessibility = await new AxeBuilder({ page }).include(".qualification-band").analyze();
      expect(accessibility.violations).toEqual([]);
    }
  });
}

test("group qualifications stay readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/#qualification-band-title`);
    const heading = page.locator("#qualification-band-title");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS("font-size", "32px");
    const headingBox = await heading.boundingBox();
    expect(headingBox!.x).toBeGreaterThanOrEqual(0);
    expect(headingBox!.x + headingBox!.width).toBeLessThanOrEqual(320);
  } finally {
    await context.close();
  }
});
