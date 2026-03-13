const { BasePage } = require('./BasePage');

class DirectoryPage extends BasePage {

  constructor(page) {
    super(page);
    this.pageTitle            = page.locator('h6:has-text("Directory")');
    this.employeeNameInput    = page.locator("//input[@placeholder='Type for hints...']");
    this.searchButton         = page.locator("//button[normalize-space()='Search']");
    this.resetButton          = page.locator('button[type="reset"]:has-text("Reset")');

  
    this.autocompleteOptions  = page.locator('.oxd-autocomplete-option');
    this.resultCards         = page.locator('.orangehrm-directory-card');
    this.resultNames         = page.locator('p.orangehrm-directory-card-header');
    this.noRecordsMessage    = page.locator('.orangehrm-horizontal-padding span:has-text("No Records Found")');
  }

  async waitForDirectoryPage() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getModuleTitle() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.pageTitle.textContent()).trim();
  }

  async typeEmployeeName(firstName) {
    await this.employeeNameInput.click();
    await this.employeeNameInput.pressSequentially(firstName, { delay: 100 });
    await this.autocompleteOptions.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.autocompleteOptions.filter({ hasText: firstName }).first().click();
  }

  async searchByEmployeeName(employeeName) {
    await this.employeeNameInput.fill(employeeName);
    await this.searchButton.click();
    await this.resultCards.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async getResultsCount() {
    return await this.resultCards.count();
  }

  async getFirstResultName() {
    await this.resultNames.first().waitFor({ state: 'visible', timeout: 10000 });
    return (await this.resultNames.first().textContent()).trim();
  }

  async getAllResultNames() {
    await this.resultNames.first().waitFor({ state: 'visible', timeout: 15000 });
    const names = await this.resultNames.allTextContents();
    return names.map(n => n.trim());
  }

  async isEmployeeInResults(fullName) {
    const names = await this.getAllResultNames();
    return names.some(name => name === fullName);
  }

  async resetSearch() {
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { DirectoryPage };
