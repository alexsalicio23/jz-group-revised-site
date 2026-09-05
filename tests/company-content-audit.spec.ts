import { expect, test, type APIRequestContext, type TestInfo } from "@playwright/test";
import { divisionPageList, getDivisionPage } from "../app/content-data";
import { buildContactIntentHref, parseContactIntent, rentalContainerOptions } from "../app/contact/contact-intent";
import { templates, type TemplateSlug } from "../app/templates/template-data";

const containerSelections = [
  { title: "15-yard pull trailer", token: "15-trailer" },
  { title: "15-yard roll-off bin", token: "15-rolloff" },
  { title: "20-yard roll-off bin", token: "20-rolloff" },
  { title: "30-yard roll-off bin", token: "30-rolloff" },
] as const;

const developmentProperties = [
  "Villa Valencia",
  "AquaVue Las Olas",
  "AquaMar Las Olas",
  "AquaBlu Fort Lauderdale",
  "1800 Las Olas",
  "AquaLuna Las Olas",
  "AquaVita Las Olas",
];

test.describe("company content contract", () => {
  test("Waste recycling has its own service destination", () => {
    const card = templates["waste-management"].services.find((service) => service.name === "Recycling coordination");
    expect(card?.href).toBe("/waste-management/services/recycling");
    expect(getDivisionPage("waste-management", ["services", "recycling"])).toBeDefined();
  });

  test("every dumpster CTA preserves its exact local rental intent", () => {
    const rentalPage = getDivisionPage("waste-management", ["services", "dumpster-rentals"]);
    const specifications = rentalPage?.sections.find((section) => section.id === "sizes")?.specifications;
    expect(specifications).toHaveLength(containerSelections.length);
    expect(rentalContainerOptions.map((option) => option.value)).toEqual(containerSelections.map((selection) => selection.token));

    for (const { title, token } of containerSelections) {
      const spec = specifications?.find((item) => item.title === title);
      const intent = { division: "waste-management", inquiry: "rental", container: token } as const;
      const href = `/contact?for=waste-management&inquiry=rental&container=${token}`;
      expect(spec?.requestHref).toBe(href);
      expect(spec?.requestHref).toBe(buildContactIntentHref(intent));
      expect(parseContactIntent(new URL(href, "https://company.invalid").search)).toEqual(intent);
    }
  });

  test("non-container services keep their ordinary contact fallback", () => {
    for (const page of divisionPageList.filter((entry) => entry.key !== "waste-management/services/dumpster-rentals")) {
      for (const spec of page.sections.flatMap((section) => section.specifications ?? [])) {
        expect(spec.requestHref, `${page.key}: ${spec.title}`).toBeUndefined();
      }
    }
  });

  test("robotic demolition points to explicit capability content", () => {
    const card = templates.demolition.services.find((service) => service.name === "Robotic demolition");
    expect(card?.href).toBe("/demolition/services/concrete-work#robotic-demolition");
    const page = getDivisionPage("demolition", ["services", "concrete-work"]);
    const section = page?.sections.find((entry) => entry.id === "robotic-demolition");
    expect(section?.title).toBe("Robotic Demolition");
    const copy = section?.paragraphs?.join(" ");
    expect(copy).toMatch(/remote demolition/i);
    expect(copy).toMatch(/whether robotic demolition is appropriate/i);
    expect(copy).not.toMatch(/Brokk|Husqvarna|electric|zero.emission|\d/);
  });

  test("Development removes research notes without adding project attribution", () => {
    const pages = divisionPageList.filter((page) => page.division === "development");
    expect(JSON.stringify([templates.development, ...pages])).not.toMatch(/JZ to confirm|publicly|source site|public (?:site|mission|positioning)|20\+/i);

    const portfolio = getDivisionPage("development", ["projects"]);
    const cards = portfolio?.sections.find((section) => section.id === "portfolio")?.cards;
    expect(cards?.map((card) => card.title)).toEqual(developmentProperties);
    expect(portfolio?.projectNote).toContain("does not establish JZ's role");
    expect(portfolio?.projectNote).toContain("confirmed role, scope");
    for (const card of cards ?? []) {
      expect(card.media).toBeUndefined();
      expect(card.description).not.toMatch(/\d|developer|general contractor|construction manager|delivered by|built by|JZ/i);
    }
    expect(portfolio?.introduction).not.toContain("through construction oversight");
  });

  test("Development keeps its division roster without unverified biographies or portraits", () => {
    const team = getDivisionPage("development", ["about"])?.sections.find((section) => section.id === "team");
    expect(team?.cards).toEqual([
      { title: "Alexander DeArmas", subtitle: "President" },
      { title: "Zenaida Balseiro", subtitle: "Secretary" },
      { title: "Alberto DeArmas", subtitle: "Head of Development" },
      { title: "Christopher Carter", subtitle: "Vice President" },
    ]);
    expect(team?.media).toBeUndefined();
    expect(team?.mediaLabel).toBeUndefined();
  });

  test("representative media is labeled without inventing project matches", () => {
    const healthcare = getDivisionPage("construction", ["projects", "healthcare"]);
    const healthcareMedia = [healthcare?.heroMedia, healthcare?.sections.find((section) => section.id === "experience")?.media];
    for (const media of healthcareMedia) {
      expect(media?.src).toBe("/media/jzg/division-construction.webp");
      expect(media?.alt).toMatch(/representative commercial.*100 Biscayne/i);
      expect(media?.caption).toContain("does not document the healthcare projects");
    }
    for (const path of ["about", "projects"]) {
      const media = getDivisionPage("development", [path])?.heroMedia;
      expect(media?.src).toBe("/media/development/workforce-housing-kitchen.webp");
      expect(media?.alt).toBe("Representative residential kitchen interior");
      expect(media?.caption).toMatch(/representative residential interior/i);
    }
    expect(templates.construction.feature.facts.some((fact) => fact.label === "Lead project")).toBe(false);
    expect(templates.development.hero.alt).not.toContain("delivered by");
  });
});

async function requireCompany(request: APIRequestContext, testInfo: TestInfo, company: TemplateSlug) {
  test.skip(!testInfo.project.use.baseURL, "Browser checks require an existing company server and a configured baseURL.");
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  test.skip(!html.includes(`metric-division-${company}`), `This check targets the ${company} company build.`);
}

test.describe("company content browser", () => {
  test("Waste homepage opens Recycling and rental selections reach local contact", async ({ page, request }, testInfo) => {
    await requireCompany(request, testInfo, "waste-management");
    await page.goto("/");
    const recycling = page.locator(".metric-service-index").getByRole("link", { name: /Recycling coordination/i });
    await expect(recycling).toHaveAttribute("href", "/services/recycling");
    await recycling.click();
    await expect(page).toHaveURL(/\/services\/recycling$/);

    for (const { title, token } of containerSelections) {
      await page.goto("/services/dumpster-rentals");
      const card = page.locator(".metric-spec-grid article").filter({ has: page.getByRole("heading", { name: title }) });
      const cta = card.getByRole("link", { name: "Request this service" });
      await expect(cta).toHaveAttribute("href", `/contact?for=waste-management&inquiry=rental&container=${token}`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`/contact\\?for=waste-management&inquiry=rental&container=${token}$`));
    }
  });

  test("Demolition robotic card reaches its named section", async ({ page, request }, testInfo) => {
    await requireCompany(request, testInfo, "demolition");
    await page.goto("/");
    const robotic = page.locator(".metric-service-index").getByRole("link", { name: /Robotic demolition/i });
    await expect(robotic).toHaveAttribute("href", "/services/concrete-work#robotic-demolition");
    await robotic.click();
    await expect(page).toHaveURL(/\/services\/concrete-work#robotic-demolition$/);
    await expect(page.locator("#robotic-demolition").getByRole("heading", { name: /^Robotic Demolition$/i })).toBeVisible();
  });

  test("healthcare page visibly identifies its representative commercial image", async ({ page, request }, testInfo) => {
    await requireCompany(request, testInfo, "construction");
    await page.goto("/projects/healthcare");
    const captions = page.locator(".metric-media-caption");
    await expect(captions).toHaveCount(2);
    for (const caption of await captions.all()) {
      await expect(caption).toBeVisible();
      await expect(caption).toContainText("does not document the healthcare projects");
    }
    await expect(page.locator(".metric-content-hero-media img")).toHaveAttribute("alt", /Representative commercial.*100 Biscayne/);
    await expect(page.locator("#experience .metric-content-media")).toHaveAttribute("aria-describedby", "experience-media-caption");
  });

  test("Development keeps seven property references with clear attribution limits", async ({ page, request }, testInfo) => {
    await requireCompany(request, testInfo, "development");
    await page.goto("/");
    await expect(page.locator("main")).not.toContainText(/JZ to confirm|publicly|source site/i);
    await page.goto("/projects");
    await expect(page.locator("#portfolio .metric-content-card")).toHaveCount(developmentProperties.length);
    for (const property of developmentProperties) {
      await expect(page.locator("#portfolio").getByRole("heading", { name: property })).toBeVisible();
    }
    await expect(page.getByText(/A listing does not establish JZ's role/)).toBeVisible();
    await expect(page.locator(".metric-media-caption")).toContainText("not identified as any of the properties");
    await expect(page.locator("main")).not.toContainText(/JZ to confirm|publicly|source site/i);
  });
});
