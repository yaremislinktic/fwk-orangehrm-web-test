const { test, expect }                              = require('@playwright/test');
const { LoginPage }                                 = require('../pages/LoginPage');
const { DashboardPage }                             = require('../pages/DashboardPage');
const { DirectoryPage }                             = require('../pages/DirectoryPage');
const { credentials, primaryEmployee, expectedMessages, urls } = require('../test-data/testData');

test.describe('📂 Módulo Directory — OrangeHRM', () => {

  let loginPage;
  let dashboardPage;
  let directoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    directoryPage = new DirectoryPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await dashboardPage.isDashboardLoaded();
    await dashboardPage.goToDirectory();
  });

  test('TC-DIR-SMOKE-01: Iniciar sesión y verificar título Directory', async ({ page }) => {

    await test.step('DADO QUE el usuario está autenticado y en el módulo Directory', async () => {
      await expect(page).toHaveURL(urls.directory);
      console.log(' Módulo Directory cargado');
    });

    await test.step('ENTONCES el título Directory es visible', async () => {
      const title = await directoryPage.getModuleTitle();
      expect(title).toBe(expectedMessages.directory.moduleTitle);
      await expect(page).toHaveURL(urls.directory);
      console.log(` Título verificado: "${title}" — URL: ${page.url()}`);
    });

  });

  test('TC-DIR-HP-01: Buscar empleado por nombre en Directory — Happy Path', async ({ page }) => {

    await test.step('DADO QUE el usuario está en el módulo Directory', async () => {
      await expect(page).toHaveURL(urls.directory);
      console.log(' Módulo Directory cargado');
    });

    await test.step(`CUANDO ingresa "${primaryEmployee.firstName}" en Employee Name y selecciona de la lista desplegable`, async () => {
      await directoryPage.typeEmployeeName(primaryEmployee.firstName);
      console.log(` Empleado "${primaryEmployee.firstName}" seleccionado del autocomplete`);
    });

    await test.step('Y hace clic en el botón Search', async () => {
      await directoryPage.searchButton.click();
      console.log(' Clic en Search ejecutado');
    });

    await test.step(`ENTONCES se muestran resultados que incluyen "${primaryEmployee.firstName} ${primaryEmployee.middleName} ${primaryEmployee.lastName}"`, async () => {
      const fullName = `${primaryEmployee.firstName} ${primaryEmployee.middleName} ${primaryEmployee.lastName}`;
      const allNames = await directoryPage.getAllResultNames();
      console.log('🔍 Nombres encontrados:', JSON.stringify(allNames));
      const found = await directoryPage.isEmployeeInResults(fullName);
      expect(found).toBeTruthy();
      console.log(` Empleado "${fullName}" encontrado en resultados`);
     
    });

  });

});
