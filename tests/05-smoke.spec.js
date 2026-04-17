const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PIMPage } = require('../pages/PIMPage');
const { credentials, urls } = require('../test-data/testData');
const { takeEvidence } = require('../utils/screenshotHelper');

test.describe('SMOKE - E2E', () => {

  let loginPage, dashboardPage, pimPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage = new PIMPage(page);
    await loginPage.goto();
  });

  test('TC-SMOKE-01: Login y navegación a PIM', async ({ page }) => {

    await test.step('Login como admin', async () => {
      await loginPage.login(credentials.admin.username, credentials.admin.password);
      const title = await loginPage.getDashboardTitle();
      expect(title).toBeDefined();
      await expect(page).toHaveURL(urls.dashboard);
    });

    await test.step('Ir a PIM y validar módulo', async () => {
      await dashboardPage.goToPIM();
      expect(await pimPage.isModuleLoaded()).toBeTruthy();
      const moduleTitle = await pimPage.getModuleTitle();
      expect(moduleTitle).toContain('Employee Information');
      await takeEvidence(page, 'TC-SMOKE-01', 'after-navigate-pim');
    });

  });

});
