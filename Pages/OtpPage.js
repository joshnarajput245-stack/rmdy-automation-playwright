import BasePage from './BasePage.js';

export default class OtpPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('OTP Verification', { exact: true });
    this.otpInputs = page.locator('input[maxlength="1"]');
    this.resendLink = page.getByText('Resend', { exact: true });
  }

  async waitForPage() {
    await this.heading.waitFor({ state: 'visible', timeout: 30000 });
  }

  async enterOtp(otp) {
    const digits = otp.replace(/\D/g, '').split('');
    const count = await this.otpInputs.count();

    for (let i = 0; i < Math.min(digits.length, count); i += 1) {
      await this.otpInputs.nth(i).fill(digits[i]);
    }
  }

  async verifySignupOtp(otp) {
    const navigationPromise = this.waitForNavigation(/\/personal-details/);
    await this.enterOtp(otp);
    await navigationPromise;
  }

  async verifyLoginOtp(otp) {
    const navigationPromise = this.waitForNavigation(
      /\/(dashboard|personal-details|Prodashboard|provider)/,
    );
    await this.enterOtp(otp);
    await navigationPromise;
  }

  async verifyForgotPasswordOtp(otp) {
    const responsePromise = this.waitForBackendResponse('/backend/auth/forgot-password/verify-otp');
    await this.enterOtp(otp);
    await responsePromise;
  }
}
