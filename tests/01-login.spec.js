
const { test, expect }                        = require('@playwright/test');
const { LoginPage }                           = require('../pages/LoginPage');
const { credentials, expectedMessages, urls } = require('../test-data/testData');
const { takeEvidence }                        = require('../utils/screenshotHelper');

test.describe('Login - OrangeHRM', () => {

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });
  test.describe('✅ Happy Path', () => {

    test('TC-LOGIN-HP-01: Login exitoso con credenciales de administrador', async ({ page }) => {

      await test.step('DADO QUE la página de Login está visible', async () => {
        const isVisible = await loginPage.isLoginPageDisplayed();
        expect(isVisible, '❌ La página de Login no está visible').toBeTruthy();
        console.log('✅ Página de Login cargada');
      });

      await test.step(`CUANDO ingreso Username válido: "${credentials.admin.username}"`, async () => {
        await loginPage.usernameInput.fill(credentials.admin.username);
        await expect(loginPage.usernameInput).toHaveValue(credentials.admin.username);
        console.log(`✅ Username: ${credentials.admin.username}`);
      });

      await test.step(`Y ingreso Password válida: "${credentials.admin.password}"`, async () => {
        await loginPage.passwordInput.fill(credentials.admin.password);
        await expect(loginPage.passwordInput).toHaveValue(credentials.admin.password);
        console.log('✅ Password ingresada correctamente');
      });

      await test.step('Y hago clic en el botón Login', async () => {
        await loginPage.loginButton.click();
        console.log('✅ Clic en Login');
      });

      await test.step(`ENTONCES el sistema redirige al Dashboard`, async () => {
        const title = await loginPage.getDashboardTitle();
        expect(title, `❌ Título esperado: "${expectedMessages.login.dashboardTitle}" — obtenido: "${title}"`)
          .toBe(expectedMessages.login.dashboardTitle);
        await expect(page).toHaveURL(urls.dashboard);
        console.log(`✅ Login exitoso — Título: "${title}" | URL: ${page.url()}`);
   
      });

    });

  }); 

  test.describe('❌ Unhappy Path', () => {

       test('TC-LOGIN-UP-01: Login fallido con password incorrecta', async ({ page }) => {

      await test.step('DADO QUE la página de Login está visible', async () => {
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      });

      await test.step(`CUANDO ingreso Username válido: "${credentials.wrongPassword.username}"`, async () => {
        await loginPage.usernameInput.fill(credentials.wrongPassword.username);
        await expect(loginPage.usernameInput).toHaveValue(credentials.wrongPassword.username);
      });

      await test.step(`Y ingreso Password INCORRECTA: "${credentials.wrongPassword.password}"`, async () => {
        await loginPage.passwordInput.fill(credentials.wrongPassword.password);
        await expect(loginPage.passwordInput).toHaveValue(credentials.wrongPassword.password);
      });

      await test.step('Y hago clic en el botón Login', async () => {
        await loginPage.loginButton.click();
      });

      await test.step(`ENTONCES aparece error: "${expectedMessages.login.invalidCredentials}"`, async () => {
        const errorMsg = await loginPage.getErrorMessage();
        await expect(loginPage.errorAlert).toBeVisible();
        expect(errorMsg).toContain(expectedMessages.login.invalidCredentials);
        await expect(page).toHaveURL(urls.loginPage);
        console.log(`✅ Error correcto: "${errorMsg}"`);
        await takeEvidence(page, 'TC-LOGIN-UP-01', 'wrong-password'); 
    
      });

    });

    test('TC-LOGIN-UP-02: Login fallido con username incorrecto', async ({ page }) => {

      await test.step('DADO QUE la página de Login está visible', async () => {
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      });

      await test.step(`CUANDO ingreso Username INCORRECTO: "${credentials.wrongUsername.username}"`, async () => {
        await loginPage.usernameInput.fill(credentials.wrongUsername.username);
        await expect(loginPage.usernameInput).toHaveValue(credentials.wrongUsername.username);
      });

      await test.step(`Y ingreso Password: "${credentials.wrongUsername.password}"`, async () => {
        await loginPage.passwordInput.fill(credentials.wrongUsername.password);
        await expect(loginPage.passwordInput).toHaveValue(credentials.wrongUsername.password);
      });

      await test.step('Y hago clic en el botón Login', async () => {
        await loginPage.loginButton.click();
      });

      await test.step(`ENTONCES aparece error: "${expectedMessages.login.invalidCredentials}"`, async () => {
        const errorMsg = await loginPage.getErrorMessage();
        await expect(loginPage.errorAlert).toBeVisible();
        expect(errorMsg).toContain(expectedMessages.login.invalidCredentials);
        await expect(page).toHaveURL(urls.loginPage);
        console.log(`✅ Error correcto: "${errorMsg}"`);
  
      });

    });

    test('TC-LOGIN-UP-03: Login fallido con username vacío', async ({ page }) => {

      await test.step('DADO QUE la página de Login está visible', async () => {
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      });

      await test.step('CUANDO dejo el campo Username VACÍO', async () => {
        console.log('⚠️  Username dejado vacío intencionalmente');
      });

      await test.step(`Y ingreso Password: "${credentials.emptyUsername.password}"`, async () => {
        await loginPage.passwordInput.fill(credentials.emptyUsername.password);
      });

      await test.step('Y hago clic en el botón Login', async () => {
        await loginPage.loginButton.click();
      });

      await test.step('ENTONCES aparece validación de campo requerido en Username', async () => {
        const messages = await loginPage.getRequiredMessages();
        expect(messages.length, '❌ Se esperaba al menos 1 mensaje de campo requerido').toBeGreaterThan(0);
        expect(messages.some(m => m.includes(expectedMessages.login.requiredField))).toBeTruthy();
        await expect(page).toHaveURL(urls.loginPage);
        console.log(`✅ Validación requerido: ${messages}`);
      
      });

    });

    test('TC-LOGIN-UP-04: Login fallido con password vacía', async ({ page }) => {

      await test.step('DADO QUE la página de Login está visible', async () => {
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      });

      await test.step(`CUANDO ingreso Username: "${credentials.emptyPassword.username}"`, async () => {
        await loginPage.usernameInput.fill(credentials.emptyPassword.username);
      });

      await test.step('Y dejo el campo Password VACÍO', async () => {
        console.log('⚠️  Password dejada vacía intencionalmente');
      });

      await test.step('Y hago clic en el botón Login', async () => {
        await loginPage.loginButton.click();
      });

      await test.step('ENTONCES aparece validación de campo requerido en Password', async () => {
        const messages = await loginPage.getRequiredMessages();
        expect(messages.length).toBeGreaterThan(0);
        expect(messages.some(m => m.includes(expectedMessages.login.requiredField))).toBeTruthy();
        await expect(page).toHaveURL(urls.loginPage);
        console.log(`✅ Validación requerido: ${messages}`);
      });

    });

    test('TC-LOGIN-UP-05: Login fallido con ambos campos vacíos', async ({ page }) => {

      await test.step('DADO QUE la página de Login está visible', async () => {
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
      });

      await test.step('CUANDO dejo Username Y Password VACÍOS', async () => {
        console.log('⚠️  Ambos campos dejados vacíos intencionalmente');
      });

      await test.step('Y hago clic en el botón Login', async () => {
        await loginPage.loginButton.click();
      });

      await test.step('ENTONCES aparecen 2 mensajes de campo requerido (uno por campo)', async () => {
        const messages = await loginPage.getRequiredMessages();
        expect(messages.length, `❌ Se esperaban 2 errores de campo requerido — obtenidos: ${messages.length}`).toBe(2);
        messages.forEach(m =>
          expect(m, `❌ Mensaje inesperado: "${m}"`).toContain(expectedMessages.login.requiredField)
        );
        await expect(page).toHaveURL(urls.loginPage);
        console.log(`✅ Validaciones requerido (${messages.length}): ${messages}`);

      });

    });

  }); 

});
