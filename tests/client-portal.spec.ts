import { expect, test } from "@playwright/test";

test("client portal requires authentication and supports login and logout", async ({ page }) => {
  await page.goto("/client-portal");
  await expect(page).toHaveURL(/\/client-login$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);

  await page.getByLabel("Access ID").fill("jz-client");
  await page.getByLabel("Password").fill("test-portal-password");
  await page.getByRole("button", { name: "Open dashboard" }).click();

  await expect(page).toHaveURL(/\/client-portal$/);
  await expect(page.locator(".portal-brand img")).toHaveCSS("filter", "none");
  await expect(page.getByRole("heading", { name: "Progress Dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Project Phases" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Needed From JZ" })).toBeVisible();
  await expect(page.getByText("Confirmed JZ delivery roles for Development portfolio listings and Construction case studies")).toBeVisible();
  await expect(page.getByText("The four-company audit repairs passed verification. Mobile, navigation, contact, privacy, and content updates are included in this release; final content and domain approvals remain.")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);

  const overflows = await page.locator("body *").evaluateAll((elements) =>
    elements.filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.className),
  );
  expect(overflows).toEqual([]);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/client-login$/);
});

test("client portal rejects invalid credentials", async ({ page }) => {
  await page.goto("/client-login");
  await page.getByLabel("Access ID").fill("wrong-client");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Open dashboard" }).click();

  await expect(page).toHaveURL(/error=invalid/);
  await expect(page.locator(".portal-form-alert")).toContainText("not recognized");
});
