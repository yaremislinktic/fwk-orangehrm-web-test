
const { BasePage } = require('./BasePage');
class DashboardPage extends BasePage {

  constructor(page) {
    super(page);
    this.dashboardTitle = page.locator("//h6[normalize-space()='Dashboard']");

    this.menuPIM           = page.locator("//span[normalize-space()='PIM']");
    this.menuDirectory     = page.locator("//span[normalize-space()='Directory']");
    this.submenuPIM        = page.locator("//ul[contains(@class,'oxd-main-menu-item--open')]");
    this.submenuAddEmployee = page.locator("//a[normalize-space()='Add Employee']");
  }

  async isDashboardLoaded() {
    await this.page.waitForURL(/.*dashboard/, { timeout: 30000 });
    return true;
  }

  async getDashboardTitle() {
    await this.dashboardTitle.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.dashboardTitle.textContent()).trim();
  }

  async goToPIM() {
    await this.menuPIM.waitFor({ state: 'visible', timeout: 30000 });
    await this.menuPIM.click();
    await this.page.waitForURL(/.*pim\/viewEmployeeList/, { timeout: 30000 });
  }

  async goToDirectory() {
    await this.menuDirectory.click();
    await this.page.waitForURL(/.*directory\/viewDirectory/);
  }
}

module.exports = { DashboardPage };
