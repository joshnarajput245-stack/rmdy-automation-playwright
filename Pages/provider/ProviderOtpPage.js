import OtpPage from '../OtpPage.js';

export default class ProviderOtpPage extends OtpPage {
  async verifyProviderSignupOtp(otp) {
    await this.waitForPage();
    await this.verifySignupOtp(otp);
  }

  async verifyEmailOnPersonalDetails(otp) {
    await this.waitForPage();
    const navigationPromise = this.waitForNavigation(/\/personal-details/);
    await this.enterOtp(otp);
    await navigationPromise;
  }
}
