import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("presents the group, specialty, projects, and contact without overflow", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("JZ GROUP");
  await expect(page.getByText("Four specialists. One accountable group.")).toBeVisible();
  await expect(page.locator("[data-division]")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Built for the work others avoid." })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Comparable work/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Send the scope/ })).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);

  await expect(page.getByText("Access granted", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Control the cut", { exact: false })).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);

  if (testInfo.project.name === "desktop") {
    const construction = page.locator('[data-division="construction"]');
    await construction.hover();
    await expect(page.locator("#top")).toHaveAttribute("data-active", "construction");
  } else {
    const menu = page.locator(".v3-mobile-menu > summary");
    await menu.click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await menu.click();
  }

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Baptist Medical Arts Building/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Baptist Medical Arts Building" })).toBeVisible();
  await page.getByRole("button", { name: "Close project preview" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-projects.png`),
    fullPage: false,
  });
});
