import BasePage from '../BasePage.js';
import { fillDatePickerInScope, toggleSwitchByLabel } from '../../utils/muiHelpers.js';

export default class ProviderEducationPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Education', { exact: true });
    this.addButton = page.getByRole('button', { name: 'Add' }).first();
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.drawer = page.locator('.MuiDrawer-paper');
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async addEducation({ degree, schoolName }) {
    await this.addButton.click();
    await this.drawer.waitFor({ state: 'visible' });

    await this.drawer.getByLabel('Degree/Certification').fill(degree);
    await this.drawer.getByLabel('Field of Study/School').fill(schoolName);
    await fillDatePickerInScope(this.drawer, this.page, 'Start Date', '01/01/2015');
    await toggleSwitchByLabel(this.drawer, 'I am currently studying here');

    await this.drawer.getByRole('button', { name: 'Save' }).click();
    await this.drawer.waitFor({ state: 'hidden', timeout: 30000 });
  }

  async continue() {
    const navigationPromise = this.waitForNavigation(/\/provider-certifications/);
    await this.nextButton.click();
    await navigationPromise;
  }

  async complete(education) {
    await this.waitForPage();
    await this.addEducation(education);
    await this.continue();
  }
}
