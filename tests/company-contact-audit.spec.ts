import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { webcrypto } from "node:crypto";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { NextResponse } from "next/server.js";
import * as contactIntent from "../app/contact/contact-intent";
import { groupContactHref, groupSiteUrl, validateGroupSiteUrl } from "../app/company-sites";

type MockEmail = {
  to: string[];
  replyTo: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
};

const compiledHandler = ts.transpileModule(readFileSync(resolve("app/api/contact/route.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function mockContactHandler(options: { company?: string; configured?: boolean; failDelivery?: number } = {}) {
  const sent: MockEmail[] = [];
  const exports: { POST?: (request: Request) => Promise<Response> } = {};
  // No fetch or real Resend module is exposed in this VM. All email calls are captured in memory.
  runInNewContext(compiledHandler, {
    exports,
    require(id: string) {
      if (id === "next/server") return { NextResponse };
      if (id === "@/app/site-url") return { getSiteUrl: () => "https://group.example.invalid" };
      if (id === "@/app/contact/contact-intent") return contactIntent;
      if (id === "@/app/company-sites") return { getActiveCompanySite: () => options.company ?? null, groupContactHref };
      if (id === "resend") return {
        Resend: class {
          emails = {
            send: async (email: MockEmail) => {
              sent.push(email);
              return sent.length === options.failDelivery ? { error: { message: "Mock delivery failure" } } : { data: { id: "mock-only" } };
            },
          };
        },
      };
      throw new Error(`Unexpected handler dependency: ${id}`);
    },
    process: { env: options.configured === false ? {} : {
      RESEND_API_KEY: "mock-only-not-a-secret",
      CONTACT_FROM_EMAIL: "sender@example.invalid",
      DEMOLITION_ESTIMATING_EMAIL: "demolition@example.invalid",
      CONSTRUCTION_ESTIMATING_EMAIL: "construction@example.invalid",
      WASTE_ESTIMATING_EMAIL: "waste@example.invalid",
      DEVELOPMENT_ESTIMATING_EMAIL: "development@example.invalid",
    } },
    Buffer, File, FormData, Headers, URL, crypto: webcrypto,
    console: { error: () => undefined },
  });
  return { post: exports.POST!, sent };
}

function rentalForm(overrides: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Contact Audit", email: "audit@example.invalid", division: "waste-management",
    inquiry: "rental", projectLocation: "Miami", materialType: "Concrete",
    container: "15-trailer", deliveryDate: "2026-10-10", consent: "yes", ...overrides,
  })) data.set(key, value);
  return data;
}

function bidForm(overrides: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Contact Audit", email: "audit@example.invalid", division: "construction",
    company: "Audit Company", projectType: "Renovation", projectLocation: "Miami",
    facilityStatus: "Vacant or unoccupied site", message: "Mock project only", consent: "yes", ...overrides,
  })) data.set(key, value);
  return data;
}

function request(data: FormData, headers: Record<string, string> = {}) {
  return new Request("https://group.example.invalid/api/contact", {
    method: "POST", body: data, headers: { origin: "https://group.example.invalid", "sec-fetch-site": "same-origin", ...headers },
  });
}

test("contact intents carry only allowlisted company and rental tokens", () => {
  for (const { value } of contactIntent.rentalContainerOptions) {
    const intent = contactIntent.parseContactIntent(`?company=waste-management&inquiry=rental&container=${value}&name=Private&email=private@example.invalid&projectLocation=private&redirect=https://evil.invalid`);
    expect(intent).toEqual({ division: "waste-management", inquiry: "rental", container: value });
    expect(contactIntent.buildContactIntentHref(intent)).toBe(`/contact?for=waste-management&inquiry=rental&container=${value}`);
    expect(groupContactHref(intent)).toBe(`${groupSiteUrl}/contact?for=waste-management&inquiry=rental&container=${value}`);
  }
  expect(contactIntent.parseContactIntent("?for=constructor&company=Private%20Company&inquiry=rental&container=unknown", "construction")).toEqual({ division: "construction" });
  expect(contactIntent.parseContactIntent("?for=demolition&company=waste-management&inquiry=rental&container=15-trailer")).toEqual({ division: "demolition" });
  expect(contactIntent.parseContactIntent("?for=waste-management&inquiry=rental&container=javascript:alert(1)")).toEqual({ division: "waste-management", inquiry: "rental" });
  expect(contactIntent.parseContactIntent("?for=waste-management&inquiry=anything&container=15-trailer")).toEqual({ division: "waste-management" });
  expect(contactIntent.parseContactIntent("?for=waste-management&for=construction&inquiry=rental")).toEqual({ division: "waste-management", inquiry: "rental" });
});

test("group handoff configuration requires a clean HTTPS origin", () => {
  expect(validateGroupSiteUrl(undefined)).toBe("https://www.jzgroupmiami.com");
  expect(validateGroupSiteUrl(" https://group-preview.vercel.app/ ")).toBe("https://group-preview.vercel.app");
  for (const value of ["http://example.com", "javascript:alert(1)", "not-a-url", "https://user:pass@example.com", "https://example.com/contact", "https://example.com?email=private", "https://example.com/#fragment"]) {
    expect(() => validateGroupSiteUrl(value)).toThrow();
  }
});

test("all company APIs decline submissions before reading the body", async () => {
  for (const company of contactIntent.contactDivisions) {
    const handler = mockContactHandler({ company });
    let read = false;
    const result = await handler.post({ formData: async () => { read = true; throw new Error("Must not read company request"); } } as unknown as Request);
    expect(result.status).toBe(409);
    expect(await result.json()).toMatchObject({ ok: false, contactUrl: `${groupSiteUrl}/contact?for=${company}` });
    expect(read).toBe(false);
    expect(handler.sent).toHaveLength(0);
  }
});

test("minimal rental inquiries route both emails through the mock only", async () => {
  for (const { value, label } of contactIntent.rentalContainerOptions) {
    const handler = mockContactHandler();
    const result = await handler.post(request(rentalForm({ container: value })));
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toMatchObject({ ok: true, reference: expect.stringMatching(/^[A-F0-9]{8}$/) });
    expect(handler.sent).toHaveLength(2);
    expect(handler.sent[0].to).toEqual(["waste@example.invalid"]);
    expect(handler.sent[0].replyTo).toBe("audit@example.invalid");
    for (const email of handler.sent) {
      expect(email.html).toContain(label);
      expect(email.html).toContain("Concrete");
      expect(email.html).toContain("2026-10-10");
    }
    expect(handler.sent[1].to).toEqual(["audit@example.invalid"]);
    expect(handler.sent[1].html).toContain("not a booking");
    expect(handler.sent[1].attachments).toBeUndefined();
  }
});

test("rental required fields, consent, limits and date ordering cannot be bypassed", async () => {
  const cases: Record<string, string>[] = [
    ...["name", "email", "projectLocation", "materialType", "container", "deliveryDate", "consent"].map((key) => ({ [key]: "" })),
    { email: "invalid-email" }, { division: "demolition" }, { division: "constructor" },
    { inquiry: "unrecognized" }, { container: "15-yard" }, { consent: "no" },
    { deliveryDate: "2026-02-30" }, { deliveryDate: "10/10/2026" },
    { pickupDate: "2026-10-09" }, { pickupDate: "2026-13-01" },
    { materialType: "x".repeat(161) }, { company: "x".repeat(181) }, { message: "x".repeat(8001) },
    { planRoomUrl: "javascript:alert(1)" },
  ];
  for (const overrides of cases) {
    const handler = mockContactHandler();
    expect((await handler.post(request(rentalForm(overrides)))).status, JSON.stringify(overrides).slice(0, 100)).toBe(400);
    expect(handler.sent).toHaveLength(0);
  }
});

test("legacy bid validation remains required and generic delivery is unchanged", async () => {
  for (const field of ["name", "company", "email", "projectType", "projectLocation", "facilityStatus", "message", "consent"]) {
    const handler = mockContactHandler();
    expect((await handler.post(request(bidForm({ [field]: "" })))).status, field).toBe(400);
    expect(handler.sent).toHaveLength(0);
  }
  const handler = mockContactHandler();
  const result = await handler.post(request(bidForm({ company: "<b>Audit</b>\nCompany", message: "<script>unsafe</script>" })));
  expect(result.status).toBe(200);
  expect(handler.sent[0].to).toEqual(["construction@example.invalid"]);
  expect(handler.sent[0].html).toContain("&lt;script&gt;unsafe&lt;/script&gt;");
  expect(handler.sent[0].subject).not.toMatch(/[\r\n]/);
});

test("origin, multipart, body-size, honeypot and rate-limit protections remain active", async () => {
  const untrustedHeaders: Array<Record<string, string>> = [{ origin: "https://other.example.invalid" }, { "sec-fetch-site": "cross-site" }];
  for (const headers of untrustedHeaders) {
    const handler = mockContactHandler();
    expect((await handler.post(request(rentalForm(), headers))).status).toBe(403);
    expect(handler.sent).toHaveLength(0);
  }
  const handler = mockContactHandler();
  expect((await handler.post(new Request("https://group.example.invalid/api/contact", { method: "POST", body: "{}", headers: { "content-type": "application/json" } }))).status).toBe(415);
  expect((await handler.post(new Request("https://group.example.invalid/api/contact", { method: "POST", body: "bad multipart", headers: { "content-type": "multipart/form-data" } }))).status).toBe(400);
  expect((await handler.post(request(rentalForm(), { "content-length": String(4 * 1024 * 1024 + 1) }))).status).toBe(413);
  const honeypot = await handler.post(request(rentalForm({ companyWebsite: "bot" })));
  expect(await honeypot.json()).toEqual({ ok: true, reference: "RECEIVED" });
  expect(handler.sent).toHaveLength(0);
  const limited = mockContactHandler();
  for (let index = 0; index < 6; index++) expect((await limited.post(request(rentalForm({ consent: "" })))).status).toBe(400);
  const limitResponse = await limited.post(request(rentalForm()));
  expect(limitResponse.status).toBe(429);
  expect(limitResponse.headers.get("retry-after")).toBe("600");
  expect(limited.sent).toHaveLength(0);
});

test("rental attachments retain count, size, MIME, extension and signature checks", async () => {
  const invalidFiles = [
    new File(["%PDF-1.7"], "scope.exe", { type: "application/pdf" }),
    new File(["%PDF-1.7"], "scope.pdf", { type: "image/png" }),
    new File(["not a PDF"], "scope.pdf", { type: "application/pdf" }),
    new File(["test"], "scope.__proto__", { type: "application/octet-stream" }),
    new File(["x".repeat(3 * 1024 * 1024 + 1)], "large.pdf", { type: "application/pdf" }),
  ];
  for (const file of invalidFiles) {
    const data = rentalForm();
    data.append("attachments", file);
    const handler = mockContactHandler();
    expect((await handler.post(request(data))).status).toBe(file.size > 3 * 1024 * 1024 ? 413 : 415);
    expect(handler.sent).toHaveLength(0);
  }
  const many = rentalForm();
  for (let index = 0; index < 6; index++) many.append("attachments", new File(["%PDF-1.7"], `${index}.pdf`, { type: "application/pdf" }));
  expect((await mockContactHandler().post(request(many))).status).toBe(413);
  const valid = rentalForm({ pickupDate: "2026-10-12", company: "Optional company", facilityStatus: "Vacant site" });
  valid.append("attachments", new File(["%PDF-1.7\nMock excerpt"], "scope<unsafe>.pdf", { type: "application/pdf" }));
  const handler = mockContactHandler();
  expect((await handler.post(request(valid))).status).toBe(200);
  expect(handler.sent[0].attachments?.[0].filename).toBe("scope_unsafe_.pdf");
  expect(handler.sent[0].html).toContain("2026-10-12");
});

test("missing mail configuration and mock provider failures do not report false delivery", async () => {
  const missing = mockContactHandler({ configured: false });
  expect((await missing.post(request(rentalForm()))).status).toBe(503);
  expect(missing.sent).toHaveLength(0);
  const deliveryFailure = mockContactHandler({ failDelivery: 1 });
  expect((await deliveryFailure.post(request(rentalForm()))).status).toBe(502);
  expect(deliveryFailure.sent).toHaveLength(1);
  const confirmationFailure = mockContactHandler({ failDelivery: 2 });
  expect((await confirmationFailure.post(request(rentalForm()))).status).toBe(200);
  expect(confirmationFailure.sent).toHaveLength(2);
});

test.describe("existing preview contact UI", () => {
  test.skip(!process.env.CONTACT_AUDIT_BASE_URL, "Set CONTACT_AUDIT_BASE_URL to an already running server or preview; this suite never builds.");

  test("contact handoff or group rental form preserves safe intent without sending email", async ({ page }, testInfo) => {
    const submitted: string[] = [];
    await page.route("**/api/contact", async (route) => {
      submitted.push(route.request().postData() ?? "");
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, reference: "MOCKONLY" }) });
    });
    await page.goto(`${process.env.CONTACT_AUDIT_BASE_URL}/contact?for=waste-management&inquiry=rental&container=20-rolloff&name=Private&email=private@example.invalid`);
    const handoff = page.locator("[data-contact-handoff]");
    if (await handoff.count()) {
      await expect(page.locator("form")).toHaveCount(0);
      await expect(page.locator("input, textarea, select")).toHaveCount(0);
      const link = handoff.getByRole("link", { name: "Continue to JZ Group" });
      await expect(link).toHaveAttribute("href", /\/contact\?for=waste-management&inquiry=rental&container=20-rolloff$/);
      await expect(link).toHaveAttribute("referrerpolicy", "no-referrer");
      const target = new URL((await link.getAttribute("href"))!);
      expect(target.protocol).toBe("https:");
      expect([...target.searchParams.keys()]).toEqual(["for", "inquiry", "container"]);
      await page.screenshot({ path: testInfo.outputPath("company-contact-mobile.png"), fullPage: true });
      let navigationMethod = "";
      await page.route(target.href, async (route) => { navigationMethod = route.request().method(); await route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Mock group destination</h1>" }); });
      await link.click();
      await expect(page.getByRole("heading", { name: "Mock group destination" })).toBeVisible();
      expect(navigationMethod).toBe("GET");
      expect(submitted).toHaveLength(0);
    } else {
      const form = page.locator(".bid-form");
      await expect(form).toHaveAttribute("data-inquiry", "rental");
      await expect(form.locator('[name="container"]')).toHaveValue("20-rolloff");
      await expect(form.locator('[name="division"]')).toHaveValue("waste-management");
      for (const field of ["name", "email", "projectLocation", "materialType", "container", "deliveryDate", "consent"]) await expect(form.locator(`[name="${field}"]`)).toHaveAttribute("required", "");
      for (const field of ["company", "facilityStatus", "message"]) await expect(form.locator(`[name="${field}"]`)).not.toHaveAttribute("required", "");
      await form.locator('[name="name"]').fill("Contact Audit");
      await form.locator('[name="email"]').fill("audit@example.invalid");
      await form.locator('[name="projectLocation"]').fill("Miami");
      await form.locator('[name="materialType"]').fill("Concrete");
      await form.locator('[name="deliveryDate"]').fill("2026-10-10");
      await form.locator('[name="consent"]').check();
      await expect(form.getByRole("link", { name: "Privacy Notice" })).toHaveAttribute("href", "/privacy");
      await page.screenshot({ path: testInfo.outputPath("group-rental-mobile.png"), fullPage: true });
      await form.getByRole("button", { name: "Send rental inquiry" }).click();
      await expect(page.locator(".form-confirmation")).toContainText("MOCKONLY");
      expect(submitted).toHaveLength(1);
      expect(submitted[0]).toContain('name="container"');
      expect(submitted[0]).toContain("20-rolloff");
      await page.goto(`${process.env.CONTACT_AUDIT_BASE_URL}/contact?for=construction`);
      for (const field of ["company", "facilityStatus", "projectType", "message"]) await expect(page.locator(`.bid-form [name="${field}"]`)).toHaveAttribute("required", "");
    }
  });

  test("privacy is available with the actual providers and collection details", async ({ page }) => {
    await page.goto(`${process.env.CONTACT_AUDIT_BASE_URL}/privacy`);
    await expect(page.getByRole("heading", { name: "Privacy Notice", exact: true })).toBeVisible();
    await expect(page.locator(".privacy-content")).toContainText("Resend");
    await expect(page.locator(".privacy-content")).toContainText("Vercel");
    await expect(page.locator(".privacy-content")).toContainText("no automatic deletion schedule");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
