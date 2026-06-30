import BasePage from '../BasePage.js';

export default class ProviderSkillsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Skills and Specializations', { exact: true });
    this.skillInput = page.getByPlaceholder('Search to Add Tags');
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async addSkillAndContinue(skill) {
    await this.waitForPage();
    await this.skillInput.fill(skill);
    await this.page.getByRole('button', { name: 'Add' }).last().click();

    const navigationPromise = this.waitForNavigation(/\/provider-(set-up-stripe-account|stripe-account-success)/);
    await this.nextButton.click();
    await navigationPromise;
  }
}
