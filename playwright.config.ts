import * as dotenv from 'dotenv';

import { defineConfig, devices } from '@playwright/test';

import { Constants } from './playwright/fixtures/constants/constants.ts';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonUse: any = {
  ...devices['Desktop Chrome'],
  channel: 'chrome',
  locale: 'en_US',
  timezoneId: 'Atlantic/Reykjavik',
  viewport: { width: 1920, height: 1080 },
};

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reportSlowTests: { max: 5, threshold: 60000 * 3 },
  reporter: [['html']],
  use: {
    launchOptions: {
      args: ['--disable-web-security'],
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: Constants.THIRTY_SECONDS,
    navigationTimeout: Constants.SIXTY_SECONDS,
  },

  expect: { timeout: Constants.FORTY_SECONDS },
  timeout: Constants.FIVE_MINUTES,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: commonUse,
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...commonUse,
    //     ...devices['Desktop Firefox'],
    //     channel: 'firefox',
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...commonUse,
    //     ...devices['Desktop Safari'],
    //     channel: 'webkit',
    //   },
    // },
  ],
});
