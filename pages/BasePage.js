
class BasePage {

  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }


  async waitForElement(selector) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }


  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = { BasePage };
