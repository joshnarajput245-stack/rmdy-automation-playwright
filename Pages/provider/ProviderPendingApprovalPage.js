import BasePage from '../BasePage.js';

export default class ProviderPendingApprovalPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Pending Approval', { exact: true });
    this.checkStatusButton = page.getByRole('button', { name: 'Check Status' });
  }

  async assertOnPage() {
    await this.waitForNavigation(/\/provider-pending-approval/);
    await this.heading.waitFor({ state: 'visible', timeout: 60000 });
    await this.page
      .getByText('You will receive a notification when your profile has been reviewed.')
      .waitFor({ state: 'visible' });
    await this.checkStatusButton.waitFor({ state: 'visible' });
  }
}
