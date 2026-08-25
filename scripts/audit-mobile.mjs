import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://localhost:3100";
const outputDirectory = "artifacts/mobile-audit";
const defaultRoutes = [
  "/",
  "/demolition",
  "/construction",
  "/waste-management",
  "/development",
  "/services",
  "/projects",
  "/safety",
  "/about",
  "/contact",
];
const routes = process.env.AUDIT_ROUTES?.split(",").map((route) => route.trim()).filter(Boolean) ?? defaultRoutes;
const viewports = [
  { name: "390x693", width: 390, height: 693 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  for (const route of routes) {
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const findings = await page.evaluate(() => {
      const root = document.documentElement;
      const viewportWidth = root.clientWidth;
      const selector = "h1, h2, h3, h4, p, a, button, summary, label, input, select, textarea";
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      };
      const hasHorizontalScroller = (element) => {
        let current = element.parentElement;
        while (current && current !== document.body) {
          const overflow = getComputedStyle(current).overflowX;
          if (overflow === "auto" || overflow === "scroll") return true;
          current = current.parentElement;
        }
        return false;
      };
      const label = (element) => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.classList.length ? `.${[...element.classList].slice(0, 2).join(".")}` : ""}`;

      const offscreen = [];
      const clipped = [];
      const touchTargets = [];
      const headingAlignment = [];

      for (const element of document.querySelectorAll(selector)) {
        if (!isVisible(element)) continue;
        if (element.closest(".form-honeypot")) continue;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);

        if (!hasHorizontalScroller(element) && (rect.left < -1 || rect.right > viewportWidth + 1)) {
          offscreen.push({ element: label(element), left: Math.round(rect.left), right: Math.round(rect.right), text: element.textContent?.trim().slice(0, 80) });
        }

        const clipsX = element.scrollWidth > element.clientWidth + 1 && style.overflowX !== "visible";
        const clipsY = element.scrollHeight > element.clientHeight + 1 && style.overflowY !== "visible";
        if (clipsX || clipsY) {
          clipped.push({ element: label(element), x: clipsX, y: clipsY, text: element.textContent?.trim().slice(0, 80) });
        }

        if ((element.matches("a, button, summary") || element.getAttribute("role") === "button") && (rect.width < 44 || rect.height < 44)) {
          touchTargets.push({ element: label(element), width: Math.round(rect.width), height: Math.round(rect.height), text: element.textContent?.trim().slice(0, 60) });
        }

        if (element.matches("h1, h2")) {
          headingAlignment.push({ element: label(element), alignment: style.textAlign, text: element.textContent?.trim().slice(0, 80) });
        }
      }

      return {
        viewportWidth,
        documentWidth: root.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        offscreen,
        clipped,
        touchTargets,
        headingAlignment,
      };
    });

    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: `${outputDirectory}/${viewport.name}-${slug}.png`, fullPage: true });
    if (route === "/") {
      for (const sectionId of ["companies", "lifecycle", "qualification-band-title"]) {
        const section = page.locator(`#${sectionId}`);
        if (await section.count()) {
          await section.evaluate((element) => {
            const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
            window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - headerHeight });
          });
          await page.waitForTimeout(350);
          await page.screenshot({ path: `${outputDirectory}/${viewport.name}-home-${sectionId}.png` });
        }
      }
    }
    report.push({ viewport: viewport.name, route, status: response?.status(), ...findings });
    await page.close();
  }

  await context.close();
}

await browser.close();
await writeFile(`${outputDirectory}/report.json`, JSON.stringify(report, null, 2));

for (const item of report) {
  const overflow = item.documentWidth - item.viewportWidth;
  console.log(`${item.viewport} ${item.route}: status=${item.status} overflow=${overflow}px offscreen=${item.offscreen.length} clipped=${item.clipped.length} touch=${item.touchTargets.length}`);
  for (const finding of [...item.offscreen, ...item.clipped].slice(0, 8)) {
    console.log(`  - ${finding.element}: ${finding.text ?? ""}`);
  }
}
