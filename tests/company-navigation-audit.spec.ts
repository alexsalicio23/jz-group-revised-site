import { expect, test, type Locator } from "@playwright/test";

// Run against each company-configured server. Group builds use a different header.
test.use({ contextOptions: { reducedMotion: "reduce" } });

test.beforeEach(async ({ context, page }) => {
  await context.route("**/*", async (route) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(route.request().method())) {
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  await page.goto("/");
  test.skip(await page.locator(".template-header").count() === 0, "Requires a company-configured server at the test baseURL.");
});

async function openMobileMenu(menu: Locator) {
  await menu.locator(":scope > summary").click();
  await expect(menu).toHaveJSProperty("open", true);
}

test.describe("company mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!await page.locator(".template-mobile-menu > summary").isVisible(), "Mobile navigation only.");
  });

  test("Services closes both disclosures, including repeated navigation to the current hash", async ({ page }, testInfo) => {
    const menu = page.locator(".template-mobile-menu");
    const companies = menu.locator(".mobile-expertise-menu");

    for (const expandedCompanies of [false, true]) {
      await openMobileMenu(menu);
      if (expandedCompanies) {
        await companies.locator(":scope > summary").click();
        await expect(companies).toHaveJSProperty("open", true);
      }

      const services = menu.getByRole("link", { name: "Services", exact: true });
      await expect(services).toHaveAttribute("href", "/#capabilities");
      await services.click();
      await expect(page).toHaveURL((url) => url.pathname === "/" && url.hash === "#capabilities");
      await expect(menu).toHaveJSProperty("open", false);
      await expect(companies).toHaveJSProperty("open", false);
      await expect(page.locator("#capabilities")).toBeInViewport();
      expect(await menu.locator("nav").evaluate((nav) => nav.contains(document.activeElement))).toBe(false);
      await expect.poll(async () => {
        const target = await page.locator("#capabilities").boundingBox();
        const header = await page.locator(".template-header").boundingBox();
        return target && header ? target.y - header.y - header.height : -Infinity;
      }).toBeGreaterThanOrEqual(-1);
    }

    await page.screenshot({ path: testInfo.outputPath("company-services-menu-closed.png") });
  });

  test("Enter and Space toggle native disclosures and Escape restores focus one level at a time", async ({ page }) => {
    const menu = page.locator(".template-mobile-menu");
    const menuSummary = menu.locator(":scope > summary");
    const companies = menu.locator(".mobile-expertise-menu");
    const companiesSummary = companies.locator(":scope > summary");

    for (const key of ["Enter", "Space"]) {
      await menuSummary.focus();
      await page.keyboard.press(key);
      await expect(menu).toHaveJSProperty("open", true);
      await companiesSummary.focus();
      await page.keyboard.press(key);
      await expect(companies).toHaveJSProperty("open", true);
      await page.keyboard.press("Tab");
      await expect(companies.getByRole("link").first()).toBeFocused();

      await page.keyboard.press("Escape");
      await expect(companies).toHaveJSProperty("open", false);
      await expect(menu).toHaveJSProperty("open", true);
      await expect(companiesSummary).toBeFocused();

      await page.keyboard.press("Escape");
      await expect(menu).toHaveJSProperty("open", false);
      await expect(menuSummary).toBeFocused();
    }
  });

  test("closing the Menu summary clears its nested disclosure before reopening", async ({ page }) => {
    const menu = page.locator(".template-mobile-menu");
    const companies = menu.locator(".mobile-expertise-menu");
    await openMobileMenu(menu);
    await companies.locator(":scope > summary").click();
    await expect(companies).toHaveJSProperty("open", true);
    await menu.locator(":scope > summary").click();
    await expect(menu).toHaveJSProperty("open", false);
    await expect(companies).toHaveJSProperty("open", false);
    await openMobileMenu(menu);
    await expect(companies).toHaveJSProperty("open", false);
  });

  test("hash changes and browser Back close navigation without leaving focus hidden", async ({ page }) => {
    const menu = page.locator(".template-mobile-menu");
    const summary = menu.locator(":scope > summary");
    const companies = menu.locator(".mobile-expertise-menu");

    await openMobileMenu(menu);
    await companies.locator(":scope > summary").click();
    await companies.getByRole("link").first().focus();
    await page.evaluate(() => { window.location.hash = "capabilities"; });
    await expect(menu).toHaveJSProperty("open", false);
    await expect(companies).toHaveJSProperty("open", false);
    expect(await menu.locator("nav").evaluate((nav) => nav.contains(document.activeElement))).toBe(false);

    await openMobileMenu(menu);
    await menu.getByRole("link", { name: "About", exact: true }).focus();
    await page.goBack();
    await expect(page).toHaveURL((url) => url.pathname === "/" && url.hash === "");
    await expect(menu).toHaveJSProperty("open", false);
    await expect(summary).toBeFocused();
  });

  test("keyboard link activation preserves company-local page routes", async ({ page }) => {
    const menu = page.locator(".template-mobile-menu");
    await openMobileMenu(menu);
    const about = menu.getByRole("link", { name: "About", exact: true });
    await expect(about).toHaveAttribute("href", "/about");
    await about.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL((url) => url.pathname === "/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(menu).toHaveJSProperty("open", false);

    await openMobileMenu(menu);
    const overview = menu.getByRole("link", { name: "Overview", exact: true });
    await expect(overview).toHaveAttribute("href", "/");
    await overview.click();
    await expect(page).toHaveURL((url) => url.pathname === "/" && url.hash === "");
    await expect(menu).toHaveJSProperty("open", false);
  });

  test("other-company links remain usable and close the menu before leaving", async ({ context, page }) => {
    const menu = page.locator(".template-mobile-menu");
    await openMobileMenu(menu);
    await menu.locator(".mobile-expertise-menu > summary").click();
    const companyLink = menu.locator(".mobile-expertise-menu a").first();
    const href = await companyLink.getAttribute("href");
    expect(href).toMatch(/^https:\/\/jz-(demolition|construction|waste-management|development)-miami\.vercel\.app$/);
    await context.route(`${href}/**`, (route) => route.fulfill({ contentType: "text/html", body: "<h1>Company destination</h1>" }));
    await menu.evaluate((element) => {
      document.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest(".mobile-expertise-menu a")) {
          sessionStorage.setItem("company-navigation-closed", String(!element.hasAttribute("open") && !element.querySelector("details[open]")));
        }
      }, { once: true });
    });
    await companyLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`${href}/`);
    await expect(page.getByRole("heading", { name: "Company destination" })).toBeVisible();
    await page.goBack();
    expect(await page.evaluate(() => sessionStorage.getItem("company-navigation-closed"))).toBe("true");
  });
});

test("desktop company switcher retains click and keyboard disclosure behavior", async ({ page }) => {
  const switcher = page.locator(".division-switcher");
  const summary = switcher.locator(":scope > summary");
  test.skip(!await summary.isVisible(), "Desktop navigation only.");

  await summary.click();
  await expect(switcher).toHaveJSProperty("open", true);
  await expect(switcher.getByRole("link")).toHaveCount(3);
  await summary.click();
  await expect(switcher).toHaveJSProperty("open", false);

  for (const key of ["Enter", "Space"]) {
    await summary.focus();
    await page.keyboard.press(key);
    await expect(switcher).toHaveJSProperty("open", true);
    await page.keyboard.press("Tab");
    await expect(switcher.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(switcher).toHaveJSProperty("open", false);
    await expect(summary).toBeFocused();
  }
});

test("company footers share the current address, privacy route, reserved socials, and gradient asset", async ({ page }, testInfo) => {
  for (const route of ["/", "/about"]) {
    await page.goto(route);
    const footer = page.locator(".jz-site-footer");
    const location = footer.getByRole("link", { name: "14605 Harris Pl, Miami Lakes, FL 33014" });
    await expect(location).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=14605+Harris+Pl+Miami+Lakes+FL+33014");
    await expect(location).toHaveAttribute("target", "_blank");
    await expect(footer).not.toContainText("15219 NW 60th Ave");
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveCount(1);
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute("href", "/privacy");
    await expect(footer.locator(".jz-site-footer-social [role='img']")).toHaveCount(3);
    await expect(footer.locator(".jz-site-footer-social a, .jz-site-footer-social button")).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("href", "/");
    await expect(footer.getByRole("link", { name: "Services", exact: true })).toHaveAttribute("href", "/#capabilities");
    await expect(footer.getByRole("link", { name: "About", exact: true })).toHaveAttribute("href", "/about");

    const logos = page.locator('.template-brand img, .jz-site-footer-logo img');
    await expect(logos).toHaveCount(2);
    for (const logo of await logos.all()) {
      await expect(logo).toHaveAttribute("src", /brand-logo\.webp/);
      await expect(logo).toHaveCSS("filter", "none");
    }
  }
  await page.locator(".jz-site-footer").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("company-footer-audit.png") });
});
