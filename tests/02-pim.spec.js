const { test, expect }                        = require('@playwright/test');
const { LoginPage }                           = require('../pages/LoginPage');
const { DashboardPage }                       = require('../pages/DashboardPage');
const { PIMPage }                             = require('../pages/PIMPage');
const { credentials, expectedMessages, urls } = require('../test-data/testData');

test.describe('Módulo PIM — OrangeHRM', () => {

  let loginPage;
  let dashboardPage;
  let pimPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    pimPage       = new PIMPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await dashboardPage.isDashboardLoaded();
    await dashboardPage.goToPIM();
  });

  test('TC-PIM-SMOKE-01: Iniciar sesión y verificar título Employee Information', async ({ page }) => {

    await test.step('DADO QUE el usuario está autenticado y en el módulo PIM', async () => {
      await expect(page).toHaveURL(urls.pimEmployee);
      console.log(' Módulo PIM cargado');
    });

    await test.step('ENTONCES el título Employee Information es visible', async () => {
      const title = await pimPage.getModuleTitle();
      expect(title).toBe(expectedMessages.pim.moduleTitle);
      await expect(page).toHaveURL(urls.pimEmployee);
      console.log(` Título verificado: "${title}" — URL: ${page.url()}`);
    });

  });

});
