const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {

  constructor(page) {
    super(page);
    this.usernameInput = page.locator("input[placeholder='Username']");
    this.passwordInput = page.locator("input[placeholder='Password']");
    this.loginButton   = page.locator("button[type='submit']");
    this.loginLogo      = page.locator('.orangehrm-login-logo');
    this.dashboardTitle = page.locator("//h6[normalize-space()='Dashboard']");
    this.errorAlert     = page.locator("//div[@class='oxd-alert-content oxd-alert-content--error']");
    this.errorText      = page.locator("//div[@class='oxd-alert-content oxd-alert-content--error']//p");
    this.requiredAlerts = page.locator('.oxd-input-field-error-message');
  }

  async goto() {
    await this.navigate('/web/index.php/auth/login');
    await this.loginLogo.waitFor({ state: 'visible', timeout: 30000 });
  }

  async login(username, password) {
    if (username !== '') await this.usernameInput.fill(username);
    if (password !== '') await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getDashboardTitle() {
    await this.dashboardTitle.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.dashboardTitle.textContent()).trim();
  }

  async getErrorMessage() {
    await this.errorAlert.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.errorText.textContent()).trim();
  }

  async getRequiredMessages() {
    await this.requiredAlerts.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.requiredAlerts.count();
    const messages = [];
    for (let i = 0; i < count; i++) {
      messages.push((await this.requiredAlerts.nth(i).textContent()).trim());
    }
    return messages;
  }

  async isLoginPageDisplayed() {
    return await this.loginLogo.isVisible();
  }
}

module.exports = { LoginPage };
