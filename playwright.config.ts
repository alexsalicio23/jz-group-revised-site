import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 2,
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 180_000,
    env: {
      ...process.env,
      CLIENT_PORTAL_ACCESS_ID: "jz-client",
      CLIENT_PORTAL_PASSWORD: "test-portal-password",
      CLIENT_PORTAL_SECRET: "test-only-client-portal-secret-32-characters",
    },
  },
});
