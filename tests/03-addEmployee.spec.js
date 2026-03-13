const { test, expect }                        = require('@playwright/test');
const { LoginPage }                           = require('../pages/LoginPage');
const { DashboardPage }                       = require('../pages/DashboardPage');
const { PIMPage }                             = require('../pages/PIMPage');
const { credentials, primaryEmployee, expectedMessages, urls, assets } = require('../test-data/testData');

test.describe('Agregar Empleado — Módulo PIM', () => {

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

  test('TC-ADDEMP-SMOKE-01: Navegar al formulario Add Employee', async ({ page }) => {

    await test.step('DADO QUE el usuario está autenticado y en el módulo PIM', async () => {
      await expect(page).toHaveURL(urls.pimEmployee);
      console.log(' Módulo PIM cargado');
    });

    await test.step('CUANDO hace clic en "Add Employee" del topbar de PIM', async () => {
      await pimPage.clickAddEmployee();
      console.log(' Clic en Add Employee ejecutado');
    });

    await test.step('ENTONCES el formulario Add Employee se muestra correctamente', async () => {
      const formTitle = await pimPage.getAddEmployeeTitle();
      expect(formTitle).toBe(expectedMessages.pim.addEmployeeTitle);
      await expect(page).toHaveURL(urls.pimAddEmployee);
      console.log(` Formulario visible: "${formTitle}" — URL: ${page.url()}`);
    });

  });
  test('TC-ADDEMP-HP-01: Agregar empleado con todos los campos — Happy Path', async ({ page }) => {

    await test.step('DADO QUE el usuario abre el formulario Add Employee', async () => {
      await pimPage.clickAddEmployee();
      const formTitle = await pimPage.getAddEmployeeTitle();
      expect(formTitle).toBe(expectedMessages.pim.addEmployeeTitle);
      console.log(' Formulario Add Employee abierto');
    });

    await test.step(`CUANDO completa todos los campos: ${primaryEmployee.firstName} ${primaryEmployee.middleName} ${primaryEmployee.lastName} | ID: ${primaryEmployee.employeeId}`, async () => {
      await pimPage.fillEmployeeForm(primaryEmployee);
      await expect(pimPage.firstNameInput).toHaveValue(primaryEmployee.firstName);
      await expect(pimPage.middleNameInput).toHaveValue(primaryEmployee.middleName);
      await expect(pimPage.lastNameInput).toHaveValue(primaryEmployee.lastName);
      await expect(pimPage.employeeIdInput).toHaveValue(primaryEmployee.employeeId);
      console.log(` Campos completados — ID: ${primaryEmployee.employeeId}`);
    });

    await test.step('Y carga la foto de perfil del empleado', async () => {
      await pimPage.uploadProfilePhoto(assets.profilePhotoBase64);
      console.log(' Foto de perfil cargada');
    });

    await test.step('Y hace clic en el botón Save', async () => {
      await pimPage.saveEmployee();
      console.log(' Save ejecutado');
    });

    await test.step('ENTONCES la página Personal Details del empleado se muestra correctamente', async () => {
      const title = await pimPage.getPersonalDetailsTitle();
      expect(title).toBe(expectedMessages.pim.personalDetailsTitle);
      await expect(page).toHaveURL(urls.pimSavedProfile);
      console.log(` Empleado guardado — Título: "${title}" — URL: ${page.url()}`);
    });

  });

  test('TC-ADDEMP-UP-01: Guardar formulario sin First Name → campo requerido', async ({ page }) => {

    await test.step('DADO QUE el usuario abre el formulario Add Employee', async () => {
      await pimPage.clickAddEmployee();
      await expect(pimPage.firstNameInput).toBeVisible();
      console.log(' Formulario Add Employee abierto');
    });

    await test.step('CUANDO completa Last Name pero deja First Name vacío', async () => {
      await pimPage.lastNameInput.fill(primaryEmployee.lastName);
      console.log(' First Name dejado vacío intencionalmente');
    });

    await test.step('Y hace clic en el botón Save', async () => {
      await pimPage.saveButton.click();
    });

    await test.step(`ENTONCES aparece el mensaje "${expectedMessages.pim.requiredField}" bajo First Name`, async () => {
      const messages = await pimPage.getRequiredMessages();
      expect(messages.length).toBeGreaterThan(0);
      expect(messages.some(m => m.includes(expectedMessages.pim.requiredField))).toBeTruthy();
      await expect(page).toHaveURL(urls.pimAddEmployee);
      console.log(` Validación correcta: ${messages}`);
    });

  });
 
  test('TC-ADDEMP-UP-02: Guardar formulario sin Last Name → campo requerido', async ({ page }) => {

    await test.step('DADO QUE el usuario abre el formulario Add Employee', async () => {
      await pimPage.clickAddEmployee();
      await expect(pimPage.lastNameInput).toBeVisible();
      console.log(' Formulario Add Employee abierto');
    });

    await test.step('CUANDO completa First Name pero deja Last Name vacío', async () => {
      await pimPage.firstNameInput.fill(primaryEmployee.firstName);
      console.log('  Last Name dejado vacío intencionalmente');
    });

    await test.step('Y hace clic en el botón Save', async () => {
      await pimPage.saveButton.click();
    });

    await test.step(`ENTONCES aparece el mensaje "${expectedMessages.pim.requiredField}" bajo Last Name`, async () => {
      const messages = await pimPage.getRequiredMessages();
      expect(messages.length).toBeGreaterThan(0);
      expect(messages.some(m => m.includes(expectedMessages.pim.requiredField))).toBeTruthy();
      await expect(page).toHaveURL(urls.pimAddEmployee);
      console.log(` Validación correcta: ${messages}`);
    });

  });

}); 
