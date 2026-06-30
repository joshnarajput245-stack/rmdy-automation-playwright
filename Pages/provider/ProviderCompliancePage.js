import { expect } from '@playwright/test';
import BasePage from '../BasePage.js';

export default class ProviderCompliancePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Compliance and verification', { exact: true });
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
  }

  async selectRegulatoryBody(bodyName = 'GMC') {
    const regulatoryCard = this.page.locator('.MuiCard-root').filter({
      hasText: 'Regulatory Body - Mandatory and Non Mandatory',
    });
    await regulatoryCard.getByRole('combobox').click();
    await this.page.getByRole('option', { name: bodyName, exact: true }).click();
  }

  async fillMinimumAndContinue() {
    await this.waitForPage();
    await this.selectRegulatoryBody('GMC');

    const indemnityCard = this.page.locator('.MuiCard-root').filter({ hasText: 'Indemnity insurance' });
    await indemnityCard.getByLabel('No').click();

    const rightToWorkCard = this.page.locator('.MuiCard-root').filter({ hasText: 'Right to work' });
    await rightToWorkCard.getByLabel('Yes').click();

    const dbsCard = this.page.locator('.MuiCard-root').filter({ hasText: 'Disclosure and Barring Service (DBS)' });
    await dbsCard.getByLabel('No').click();

    await expect(this.nextButton).toBeEnabled();

    const navigationPromise = this.waitForNavigation(/\/provider-skills-specializations/);
    await this.nextButton.click();
    await navigationPromise;
  }
}
