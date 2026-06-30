import BasePage from '../BasePage.js';
import { selectVisitTypesByLabel } from '../../utils/muiHelpers.js';

export default class ProviderClinicVisitPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Clinic & Visit', { exact: true });
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async fillAndContinue(clinicName) {
    await this.waitForPage();
    await this.page.getByPlaceholder('Enter Clinic Name').fill(clinicName);
    await this.page.getByText('Loading visit types...').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    await selectVisitTypesByLabel(this.page, ['Home', 'Online']);

    const navigationPromise = this.waitForNavigation(/\/provider-insurance/);
    await this.nextButton.click();
    await navigationPromise;
  }
}
