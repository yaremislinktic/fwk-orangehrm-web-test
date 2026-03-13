const { defineConfig, devices } = require('@playwright/test');

// Variable de entorno CI
const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',

  // Orden de ejecución de specs
  testMatch: [
    '01-login.spec.js',
    '02-pim.spec.js',
    '03-addEmployee.spec.js',
    '04-directory.spec.js',
  ],

  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  timeout: 300000,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },

    headless: isCI,

    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'test-results/',
});
