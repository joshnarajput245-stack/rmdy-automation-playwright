import BasePage from '../BasePage.js';
import { fillDatePickerInScope } from '../../utils/muiHelpers.js';
import { uploadFileInput, TEST_AVATAR_PATH } from '../../utils/fileUploadHelper.js';

export default class ProviderCertificationsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Certifications', { exact: true });
    this.addButton = page.getByRole('button', { name: 'Add' }).first();
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.drawer = page.locator('.MuiDrawer-paper');
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async addCertification({ name, schoolName }, filePath = TEST_AVATAR_PATH) {
    await this.addButton.click();
    await this.drawer.waitFor({ state: 'visible' });

    await uploadFileInput(this.page, '#cert-image-upload', filePath);
    await this.drawer.getByPlaceholder('Certification Name').fill(name);
    await this.drawer.getByPlaceholder('School Name').fill(schoolName);
    await fillDatePickerInScope(this.drawer, this.page, 'Start Date', '01/01/2018');
    await fillDatePickerInScope(this.drawer, this.page, 'End Date', '01/01/2022');

    const saveButton = this.drawer.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await this.drawer.waitFor({ state: 'hidden', timeout: 120000 });
  }

  async continue() {
    const navigationPromise = this.waitForNavigation(/\/provider-compliance-verification/);
    await this.nextButton.click();
    await navigationPromise;
  }

  async complete(certification) {
    await this.waitForPage();
    await this.addCertification(certification);
    await this.continue();
  }
}
