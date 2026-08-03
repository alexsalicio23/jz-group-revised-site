import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const divisions = [
  { slug: "demolition", heading: "JZ Demolition" },
  { slug: "construction", heading: "JZ Construction" },
  { slug: "waste-management", heading: "JZ Waste Management" },
  { slug: "development", heading: "JZ Development" },
];

test("division router presents all four coordinated companies", async ({ page }) => {
  await page.goto("/divisions");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Specialists by trade");
  for (const item of divisions) {
    await expect(page.locator(`a[href="/divisions/${item.slug}"]`)).toBeVisible();
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

for (const item of divisions) {
  test(`${item.slug} route is complete and accessible`, async ({ page }) => {
    await page.goto(`/divisions/${item.slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(item.heading);
    await expect(page.getByRole("link", { name: /Send a scope/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("legacy template URLs resolve to the permanent division routes", async ({ page }) => {
  await page.goto("/templates/demolition");
  await expect(page).toHaveURL(/\/divisions\/demolition$/);
});
