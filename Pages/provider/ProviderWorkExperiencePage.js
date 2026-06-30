import BasePage from '../BasePage.js';
import { fillDatePickerInScope, toggleSwitchByLabel } from '../../utils/muiHelpers.js';

export default class ProviderWorkExperiencePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Work Experience', { exact: true });
    this.addButton = page.getByRole('button', { name: 'Add' }).first();
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.drawer = page.locator('.MuiDrawer-paper');
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async addExperience({ position, companyName, description }) {
    await this.addButton.click();
    await this.drawer.waitFor({ state: 'visible' });

    await this.drawer.getByPlaceholder('Position Name').fill(position);
    await this.drawer.getByPlaceholder('Company Name').fill(companyName);
    await fillDatePickerInScope(this.drawer, this.page, 'Start Date', '01/01/2020');
    await toggleSwitchByLabel(this.drawer, 'I currently work here');
    await this.drawer.getByPlaceholder('Description').fill(description);

    await this.drawer.getByRole('button', { name: 'Save' }).click();
    await this.drawer.waitFor({ state: 'hidden', timeout: 30000 });
  }

  async continue() {
    const navigationPromise = this.waitForNavigation(/\/provider-education/);
    await this.nextButton.click();
    await navigationPromise;
  }

  async complete(experience) {
    await this.waitForPage();
    await this.addExperience(experience);
    await this.continue();
  }
}
