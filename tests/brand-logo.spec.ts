import { expect, test } from "@playwright/test";

test("JZ logos retain the original gradient on light and dark surfaces", async ({ page }, testInfo) => {
  for (const route of ["/", "/about", "/demolition", "/templates", "/client-login"]) {
    await page.goto(route);
    const logos = page.locator('img[src*="brand-logo"]');
    expect(await logos.count()).toBeGreaterThan(0);
    for (const logo of await logos.all()) {
      await expect(logo).toHaveCSS("filter", "none");
    }

    if (route === "/") {
      await page.screenshot({ path: testInfo.outputPath("header-gradient.png") });
      if (testInfo.project.name === "desktop") {
        const travel = await page.locator("#top").evaluate((el) => el.clientHeight - innerHeight);
        await page.evaluate((y) => window.scrollTo(0, y), travel * 0.96);
        await expect(page.locator(".compact-hero-resolution")).toHaveCSS("opacity", "1");
        await expect(page.locator(".site-header .brand img")).toHaveCSS("filter", "none");
        await page.screenshot({ path: testInfo.outputPath("hero-gradient.png") });
      }
      await page.locator(".jz-site-footer").scrollIntoViewIfNeeded();
      await expect(page.locator(".jz-site-footer-brand img")).toHaveCSS("filter", "none");
      await page.screenshot({ path: testInfo.outputPath("footer-gradient.png") });
    }
  }
});
