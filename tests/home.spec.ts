import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("presents JZ specialty, proof, and contact without overflow", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Specialty demolition in active environments",
  );
  await expect(page.getByText("16,300 SF", { exact: true })).toBeVisible();
  await expect(page.getByText("Active hospital", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Proof, not promises." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Prepare bid request" })).toBeVisible();
  await expect(page.getByLabel("Service lane")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Demolition" })).toBeVisible();
  await expect(page.getByText("draft review", { exact: false })).toHaveCount(0);

  await expect(page.getByText("Access granted", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Control the cut", { exact: false })).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);

  await page.locator("#group").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-group.png`),
    fullPage: false,
  });
});

test("mobile navigation closes after selecting a destination", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");

  await expect(page.locator(".mobile-menu")).toHaveAttribute("data-ready", "true");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");

  await page.getByRole("link", { name: "Contact estimating" }).click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#contact")).toBeInViewport();
});
