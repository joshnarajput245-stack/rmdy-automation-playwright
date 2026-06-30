import BasePage from './BasePage.js';

export default class ForgotPasswordPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Forgot Password', { exact: true });
    this.emailInput = page.getByPlaceholder('Enter Email Address');
    this.verifyButton = page.getByRole('button', { name: 'Verify' });
  }

  async open() {
    await this.goto('/forgot-password');
    await this.heading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async requestOtp(email) {
    await this.emailInput.fill(email);
    const responsePromise = this.waitForBackendResponse('/backend/auth/forgot-password/request');
    await this.verifyButton.click();
    await responsePromise;
  }
}
