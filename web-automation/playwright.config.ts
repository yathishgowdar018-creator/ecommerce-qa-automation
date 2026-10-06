import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const reportsDir = path.join(__dirname, '..', 'reports', 'web');

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  outputDir: path.join(reportsDir, 'test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(reportsDir, 'html'), open: 'never' }],
    ['junit', { outputFile: path.join(reportsDir, 'junit.xml') }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    // SauceDemo uses data-test attributes, so getByTestId() will read them
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Mobile: only quick smoke tests tagged @smoke
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] }, grep: /@smoke/ },
  ],
});
