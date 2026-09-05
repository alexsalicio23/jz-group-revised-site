import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const companies = ["demolition", "construction", "waste-management"] as const;
const backgroundVideo = 'video[data-background-video="true"]';
const motionControl = 'button[aria-controls][aria-label$="background video"]';

test("a retained video reselects only when its source configuration changes", () => {
  type SourceProps = { src: string; mobileSrc?: string; mobileQuery?: string };
  const source = readFileSync(new URL("../components/ResponsiveVideo.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  let mobile = true;
  let reduced = false;
  let hookIndex = 0;
  let effect: () => void | (() => void) = () => {};
  let cleanup = () => {};
  const refs: Array<{ current: unknown }> = [];
  const media = {
    src: "",
    pause() {},
    load() {},
    hasAttribute() { return this.src !== ""; },
    getAttribute() { return this.src || null; },
    removeAttribute() { this.src = ""; },
  };
  const hooks = {
    useId: () => "retained-video",
    useState: () => [false, () => {}],
    useSyncExternalStore: () => reduced,
    useLayoutEffect: (callback: typeof effect) => { effect = callback; },
    useRef: (initial: unknown) => {
      const index = hookIndex++;
      refs[index] ??= { current: index === 0 ? media : initial };
      return refs[index];
    },
  };
  const exports: { ResponsiveVideo?: (props: SourceProps) => unknown } = {};
  // Keep hook refs across renders and exercise the real component effect without a Next build.
  runInNewContext(compiled, {
    exports,
    require: (name: string) => {
      if (name === "react") return hooks;
      if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
      if (name === "lucide-react") return { Pause: () => null, Play: () => null };
      if (name.endsWith(".module.css")) return { default: { control: "control" } };
      throw new Error(`Unexpected test import: ${name}`);
    },
    window: { matchMedia: () => ({ matches: mobile }) },
    document: { hidden: true, addEventListener() {}, removeEventListener() {} },
  });
  const render = (props: SourceProps) => {
    cleanup();
    hookIndex = 0;
    exports.ResponsiveVideo!(props);
    cleanup = effect() ?? (() => {});
  };
  const first = { src: "/first.mp4", mobileSrc: "/first-mobile.mp4" };
  render(first);
  expect(media.src).toBe(first.mobileSrc);
  mobile = false;
  render(first);
  expect(media.src).toBe(first.mobileSrc);

  const second = { src: "/second.mp4", mobileSrc: "/second-mobile.mp4" };
  render(second);
  expect(media.src).toBe(second.src);
  mobile = true;
  render({ ...second, mobileSrc: "/replacement-mobile.mp4" });
  expect(media.src).toBe("/replacement-mobile.mp4");

  reduced = true;
  render(first);
  expect(media.src).toBe("");
  reduced = false;
  render(first);
  expect(media.src).toBe(first.mobileSrc);
  mobile = false;
  render({ ...first, mobileQuery: "(max-width: 400px)" });
  expect(media.src).toBe(first.src);
  cleanup();
});

async function expectStablePoster(video: Locator) {
  await expect(video).toHaveAttribute("poster", /\S+/);
  await expect(video).toHaveAttribute("data-motion", "reduced");
  await expect(video).not.toHaveAttribute("src");
  await expect(video).not.toHaveAttribute("autoplay");
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);
  await video.page().waitForTimeout(350);
  await expect(video).toHaveJSProperty("currentTime", 0);
  const poster = (await video.getAttribute("poster"))!;
  const response = await video.page().request.get(new URL(poster, video.page().url()).href);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/^image\//);
}

async function expectPlayback(video: Locator) {
  await expect(video).toHaveJSProperty("paused", false);
  const time = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).not.toBe(time);
}

async function scrollPastHero(page: Page) {
  await page.evaluate(() => {
    const process = document.querySelector(".metric-division-process")!;
    window.scrollTo({ top: process.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  });
}

for (const company of companies) {
  test(`${company} reduced motion keeps a loaded poster without requesting video`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).pathname.endsWith(".mp4")) videoRequests.push(request.url());
    });

    await page.goto(`/templates/${company}`);
    await expectStablePoster(page.locator(`.metric-division-hero-media > ${backgroundVideo}`));
    await expect(page.locator(motionControl)).toHaveCount(0);
    expect(videoRequests).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${company}-reduced-motion.png`) });
  });

  test(`${company} keyboard controls survive viewport pause and resume`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`/templates/${company}`);
    const video = page.locator(`.metric-division-hero-media > ${backgroundVideo}`);
    const control = page.locator(".metric-division-hero-media").locator(motionControl);
    await expectPlayback(video);
    await expect(control).toHaveAccessibleName("Pause background video");
    await expect(control).toHaveAttribute("aria-controls", (await video.getAttribute("id"))!);
    expect(await control.evaluate((element) => element.closest('[aria-hidden="true"]') !== null)).toBe(false);
    await expect(control).toHaveCSS("width", "44px");
    await expect(control).toHaveCSS("height", "44px");

    // A visible control can still be buried under the hero's full-size overlays.
    await control.click({ trial: true });
    await control.focus();
    await expect(control).toBeFocused();
    await expect(control).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(video).toHaveJSProperty("paused", true);
    await expect(control).toHaveAccessibleName("Resume background video");
    const pausedTime = await video.evaluate((element: HTMLVideoElement) => element.currentTime);

    await scrollPastHero(page);
    await expect(video).not.toBeInViewport();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(video).toBeInViewport();
    await page.waitForTimeout(350);
    await expect(video).toHaveJSProperty("paused", true);
    await expect(video).toHaveJSProperty("currentTime", pausedTime);

    await control.focus();
    await page.keyboard.press("Space");
    await expectPlayback(video);
    await scrollPastHero(page);
    await expect(video).not.toBeInViewport();
    await expect(video).toHaveJSProperty("paused", true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expectPlayback(video);
    await page.screenshot({ path: testInfo.outputPath(`${company}-motion-control.png`) });
  });

  test(`${company} retains the poster with JavaScript disabled`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL,
      viewport: testInfo.project.use.viewport,
      javaScriptEnabled: false,
    });
    try {
      const page = await context.newPage();
      await page.goto(`/templates/${company}`);
      await expectStablePoster(page.locator(`.metric-division-hero-media > ${backgroundVideo}`));
      await expect(page.locator(motionControl)).toHaveCount(0);
      await expect(page.locator("h1")).toBeVisible();
    } finally {
      await context.close();
    }
  });
}

test("demolition selects one responsive encode and reacts to motion preference changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const encodes = new Set<string>();
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (/hero-demolition(?:-mobile)?\.mp4$/.test(path)) encodes.add(path);
  });
  await page.goto("/templates/demolition");
  const video = page.locator(`.metric-division-hero-media > ${backgroundVideo}`);
  const mobile = await page.evaluate(() => matchMedia("(max-width: 760px)").matches);
  const expectedSource = `/media/video/hero-demolition${mobile ? "-mobile" : ""}.mp4`;
  await expect(video).toHaveAttribute("src", expectedSource);
  await expectPlayback(video);

  await page.setViewportSize({ width: mobile ? 1440 : 390, height: 900 });
  await expect(video).toHaveAttribute("src", expectedSource);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectStablePoster(video);
  await expect(page.locator(motionControl)).toHaveCount(0);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(video).toHaveAttribute("src", expectedSource);
  await expectPlayback(video);
  expect([...encodes]).toEqual([expectedSource]);
});

test("tab visibility pauses background motion without clearing an explicit pause", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/templates/demolition");
  const video = page.locator(`.metric-division-hero-media > ${backgroundVideo}`);
  const control = page.locator(motionControl);
  await expectPlayback(video);

  // Synthetic visibility events keep this deterministic in headless Chromium.
  const setHidden = (hidden: boolean) => page.evaluate((value) => {
    Object.defineProperty(document, "hidden", { configurable: true, value });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
  await setHidden(true);
  await expect(video).toHaveJSProperty("paused", true);
  await setHidden(false);
  await expectPlayback(video);
  await control.click();
  await setHidden(true);
  await setHidden(false);
  await expect(video).toHaveJSProperty("paused", true);
  await expect(control).toHaveAccessibleName("Resume background video");
});

test("autoplay denial leaves a working manual resume control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let denied = false;
    HTMLMediaElement.prototype.play = function () {
      if (!denied && this.matches('video[data-background-video="true"]')) {
        denied = true;
        this.setAttribute("data-autoplay-denied-by-test", "true");
        return Promise.reject(new DOMException("Autoplay denied by test", "NotAllowedError"));
      }
      return play.call(this);
    };
  });
  await page.goto("/templates/construction");
  const video = page.locator(`.metric-division-hero-media > ${backgroundVideo}`);
  await expect(video).toHaveAttribute("src", /workflow-build\.mp4$/);
  await expect(video).toHaveAttribute("data-autoplay-denied-by-test", "true");
  await expect(video).toHaveJSProperty("paused", true);
  const resume = page.getByRole("button", { name: "Resume background video" });
  await resume.focus();
  await page.keyboard.press("Enter");
  await expectPlayback(video);
});

test("development feature background obeys reduced motion even after scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/templates/development");
  const video = page.locator(`.metric-division-feature-media > ${backgroundVideo}`);
  await video.scrollIntoViewIfNeeded();
  await expectStablePoster(video);
  await expect(page.locator(motionControl)).toHaveCount(0);
});

test("company overview backgrounds share the motion policy", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  test.skip(await page.locator(".metric-home").count() === 0, "Overview routes belong to the group build.");
  for (const company of companies) {
    await page.goto(`/${company}`);
    await expectStablePoster(page.locator(`.company-overview-media > ${backgroundVideo}`));
    await expect(page.locator(motionControl)).toHaveCount(0);
  }
});

test("active company content-page backgrounds expose controls and honor reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const mainClass = await page.locator("main").getAttribute("class") ?? "";
  const company = [...companies, "development"].find((slug) => mainClass.includes(`metric-division-${slug}`));
  test.skip(!company, "Company content routes require a company build.");
  const path = company === "construction" ? "/services/general-contracting"
    : company === "demolition" ? "/services/concrete-work"
      : company === "waste-management" ? "/services/dumpster-rentals" : "/about";
  await page.goto(path);
  const video = page.locator(`.metric-content-hero-media > ${backgroundVideo}`);
  await expectPlayback(video);
  const control = page.locator(".metric-content-hero-media").locator(motionControl);
  expect(await control.evaluate((element) => element.closest('[aria-hidden="true"]') !== null)).toBe(false);
  await control.click();
  await expect(video).toHaveJSProperty("paused", true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectStablePoster(video);
  await expect(page.locator(motionControl)).toHaveCount(0);
});
