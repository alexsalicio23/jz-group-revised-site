import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const templates = [
  { slug: "demolition", heading: "Specialty demolition where the building cannot stop." },
  { slug: "waste-management", heading: "Keep the site moving." },
  { slug: "construction", heading: "Field execution, made visible." },
  { slug: "development", heading: "Think beyond completion." },
];

test("client review hub presents all four company directions", async ({ page }) => {
  await page.goto("/templates");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Four companies");
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.heading);
    await expect(page.locator(".metric-service-index > a").first()).toBeVisible();
    await expect(page.locator(".metric-subpage-footer").getByRole("link", { name: "JZ Group" })).toHaveAttribute("href", "/");
  }
});

for (const item of templates) {
  test(`${item.slug} template is complete and accessible`, async ({ page }, testInfo) => {
    await page.goto(`/templates/${item.slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.heading);
    await expect(page.getByRole("heading", { name: "One clear sequence." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Send project details/ })).toBeVisible();

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
