import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const templates = [
  { slug: "demolition", heading: "Specialty demolition where the building cannot stop.", section: "Built for the work. Clear to the reviewer." },
  { slug: "waste-management", heading: "Keep the site moving.", section: "Site service should run like clockwork." },
  { slug: "construction", heading: "Field execution, made visible.", section: "From layout to finished space." },
  { slug: "development", heading: "Think beyond completion.", section: "Value is created across the entire lifecycle." },
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
    await expect(page.getByRole("link", { name: "Return to JZ Group" }).last()).toHaveAttribute("href", "/");
  }
});

for (const item of templates) {
  test(`${item.slug} template is complete and accessible`, async ({ page }, testInfo) => {
    await page.goto(`/templates/${item.slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.heading);
    await expect(page.getByRole("heading", { name: item.section })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email estimating" })).toBeVisible();

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
