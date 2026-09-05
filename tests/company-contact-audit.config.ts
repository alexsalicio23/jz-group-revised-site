import { defineConfig } from "@playwright/test";

// Focused contact checks never start a server or build the shared worktree.
export default defineConfig({
  testDir: ".",
  testMatch: "company-contact-audit.spec.ts",
  workers: 1,
  reporter: "line",
  outputDir: "../test-results/company-contact-audit",
  use: {
    baseURL: process.env.CONTACT_AUDIT_BASE_URL,
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
  },
});
