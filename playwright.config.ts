import {defineConfig} from '@playwright/test';
import {TestOption} from "./test-option";

require('dotenv').config();

export default defineConfig<TestOption>({
  timeout: 40000,
  expect: {
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50}
  },
  retries: 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // // Set your Argos token (required if not using GitHub Actions).
        // token: "<YOUR-ARGOS-TOKEN>",
      },
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    ['html']
  ],

  use: {
    headless: true,
    baseURL: 'http://localhost:4200/',
    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    },
  },

  projects: [
    // {
    //   name: 'dev',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     baseURL: 'http://localhost:4200',
    //   },
    // },
    {
      name: 'chromium'
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     browserName: 'firefox',
    //     video: {
    //       mode: 'off',
    //       size: {width: 1920, height: 1080}
    //     }
    //   }
    //   },
    // {
    //   name: 'mobile',
    //   testMatch: 'testMobile.spec.ts',
    //   use: {
    //     ...devices['Galaxy S9+'],
    //   }
    // }
    ],
  webServer: {
    command: 'npm run start',
    timeout: 120000,
    url: 'http://localhost:4200/',
  }
});
