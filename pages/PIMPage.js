const { BasePage } = require('./BasePage');

class PIMPage extends BasePage {
  constructor(page) {
    super(page);
    this.moduleTitle      = page.locator("//h5[normalize-space()='Employee Information']");
    this.addEmployeeLink  = page.locator("//a[normalize-space()='Add Employee']");
    this.addEmployeeTitle = page.locator("//h6[normalize-space()='Add Employee']");
    this.firstNameInput   = page.locator("//input[@placeholder='First Name']");
    this.middleNameInput  = page.locator("//input[@placeholder='Middle Name']");
    this.lastNameInput    = page.locator("//input[@placeholder='Last Name']");
    this.employeeIdInput  = page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']");
    this.saveButton       = page.locator("//button[normalize-space()='Save']");
    this.cancelButton     = page.locator("//button[normalize-space()='Cancel']");
    this.photoUploadButton    = page.locator("//button[@class='oxd-icon-button oxd-icon-button--solid-main employee-image-action']");
    this.personalDetailsTitle = page.locator("//h6[normalize-space()='Personal Details']");
    this.requiredAlerts   = page.locator('.oxd-input-field-error-message');
    this.successToast     = page.locator('.oxd-toast-content--success');
  }

  async isModuleLoaded() {
    await this.moduleTitle.waitFor({ state: 'visible', timeout: 30000 });
    return true;
  }

  async getModuleTitle() {
    await this.moduleTitle.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.moduleTitle.textContent()).trim();
  }

  async clickAddEmployee() {
    await this.addEmployeeLink.click();
    await this.addEmployeeTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getAddEmployeeTitle() {
    return (await this.addEmployeeTitle.textContent()).trim();
  }

  async getPersonalDetailsTitle() {
    await this.personalDetailsTitle.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.personalDetailsTitle.textContent()).trim();
  }

  async fillEmployeeForm(employee) {
    await this.firstNameInput.fill(employee.firstName);
    if (employee.middleName) {
      await this.middleNameInput.fill(employee.middleName);
    }
    await this.lastNameInput.fill(employee.lastName);

    if (employee.employeeId) {
      await this.employeeIdInput.focus();
      await this.page.keyboard.press('ControlOrMeta+a');
      await this.page.keyboard.type(employee.employeeId);
      await this.page.keyboard.press('Tab');
    }
  }

  async uploadProfilePhoto(base64Image) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.photoUploadButton.click(),
    ]);
    await fileChooser.setFiles({
      name    : 'profile-photo.png',
      mimeType: 'image/png',
      buffer  : Buffer.from(base64Image, 'base64'),
    });
  }

  async saveEmployee() {
    await this.saveButton.click();
    await this.page.waitForURL(/.*pim\/viewPersonalDetails.*/, { timeout: 20000 });
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async cancelEmployee() {
    await this.cancelButton.click();
    await this.page.waitForURL(/.*pim\/viewEmployeeList/, { timeout: 10000 });
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clearEmployeeForm() {
    await this.firstNameInput.clear();
    await this.middleNameInput.clear();
    await this.lastNameInput.clear();
    await this.employeeIdInput.clear();
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
}

module.exports = { PIMPage };
