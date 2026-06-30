import BasePage from './BasePage.js';

export default class LegalPage extends BasePage {
  constructor(page) {
    super(page);
    this.backButton = page.getByRole('button').first();
  }

  async openTerms() {
    await this.goto('/legal/terms-and-conditions');
  }

  async openPrivacy() {
    await this.goto('/legal/privacy-policy');
  }
}
