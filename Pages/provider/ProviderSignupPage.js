import SignupPage from '../SignupPage.js';

export default class ProviderSignupPage extends SignupPage {
  async openProvider() {
    await this.open('provider');
  }

  async signupWithEmailProvider({ email, password }) {
    await this.openProvider();
    await this.signupWithEmail({ email, password });
  }

  async signupWithMobileProvider(mobile) {
    await this.openProvider();
    await this.signupWithMobile(mobile);
  }
}
