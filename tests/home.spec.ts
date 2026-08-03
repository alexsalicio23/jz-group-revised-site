import { expect, test } from "@playwright/test";

test("presents JZ specialty, proof, and contact without overflow", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Specialty demolition in active environments",
  );
  await expect(page.getByText("16,300 SF", { exact: true })).toBeVisible();
  await expect(page.getByText("Active hospital", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Proof, not promises." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email estimating" })).toBeVisible();

  await expect(page.getByText("Access granted", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Control the cut", { exact: false })).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.locator("#group").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-group.png`),
    fullPage: false,
  });
});
