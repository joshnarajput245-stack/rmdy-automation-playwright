import BasePage from '../BasePage.js';

export default class ProviderInsurancePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Insurance Provider', { exact: true }).first();
    this.skipButton = page.getByRole('button', { name: 'Skip' });
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async skip() {
    await this.waitForPage();
    const navigationPromise = this.waitForNavigation(/\/provider-work-experience/);
    await this.skipButton.click();
    await navigationPromise;
  }
}
