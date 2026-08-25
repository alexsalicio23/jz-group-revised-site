import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { displayHeading } from "../app/display-text";

const templates = [
  { slug: "demolition", heading: "Demolition for Every Scope" },
  { slug: "waste-management", heading: "Keep the site moving." },
  { slug: "construction", heading: "General Contracting" },
  { slug: "development", heading: "Long-Term Development" },
];

test("client review hub presents all four company directions", async ({ page }) => {
  await page.goto("/templates");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Four Company Directions");
  for (const item of templates) {
    await expect(page.locator(`a[href="/templates/${item.slug}"]`)).toBeVisible();
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("public division URLs avoid client-review route names", async ({ page }) => {
  for (const item of templates) {
    await page.goto(`/${item.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(displayHeading(item.heading));
    await expect(page.locator(".metric-service-index > a").first()).toBeVisible();
    await expect(page.locator(".metric-subpage-footer").getByRole("link", { name: "JZ Group" })).toHaveAttribute("href", "/");
  }
});

for (const item of templates) {
  test(`${item.slug} template is complete and accessible`, async ({ page }, testInfo) => {
    await page.goto(`/templates/${item.slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(displayHeading(item.heading));
    await expect(page.getByRole("heading", { name: "Our Process" })).toBeVisible();
    await expect(page.locator(".metric-division-contact").getByRole("link").first()).toBeVisible();
    const primaryHeadingCopy = await page.locator("main h1, main h2").allTextContents();
    expect(primaryHeadingCopy.every((heading) => heading.trim().split(/\s+/).length <= 5)).toBe(true);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath(`${item.slug}-top.png`),
      fullPage: false,
    });
  });
}
