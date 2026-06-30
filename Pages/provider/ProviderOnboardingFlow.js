import { dismissCookieConsent } from '../../utils/cookieHelper.js';
import { createProviderCredentials } from '../../utils/testData.js';
import { testConfig } from '../../utils/testConfig.js';
import ProviderSignupPage from './ProviderSignupPage.js';
import ProviderOtpPage from './ProviderOtpPage.js';
import ProviderPersonalDetailsPage from './ProviderPersonalDetailsPage.js';
import ProviderClinicVisitPage from './ProviderClinicVisitPage.js';
import ProviderInsurancePage from './ProviderInsurancePage.js';
import ProviderWorkExperiencePage from './ProviderWorkExperiencePage.js';
import ProviderEducationPage from './ProviderEducationPage.js';
import ProviderCertificationsPage from './ProviderCertificationsPage.js';
import ProviderCompliancePage from './ProviderCompliancePage.js';
import ProviderSkillsPage from './ProviderSkillsPage.js';
import ProviderStripePage from './ProviderStripePage.js';
import ProviderPendingApprovalPage from './ProviderPendingApprovalPage.js';

export default class ProviderOnboardingFlow {
  constructor(page) {
    this.page = page;
    this.credentials = createProviderCredentials();
    this.signup = new ProviderSignupPage(page);
    this.otp = new ProviderOtpPage(page);
    this.personalDetails = new ProviderPersonalDetailsPage(page);
    this.clinicVisit = new ProviderClinicVisitPage(page);
    this.insurance = new ProviderInsurancePage(page);
    this.workExperience = new ProviderWorkExperiencePage(page);
    this.education = new ProviderEducationPage(page);
    this.certifications = new ProviderCertificationsPage(page);
    this.compliance = new ProviderCompliancePage(page);
    this.skills = new ProviderSkillsPage(page);
    this.stripe = new ProviderStripePage(page);
    this.pendingApproval = new ProviderPendingApprovalPage(page);
  }

  async prepare() {
    await dismissCookieConsent(this.page);
  }

  async signupWithEmail() {
    await this.prepare();
    await this.signup.signupWithEmailProvider({
      email: this.credentials.email,
      password: this.credentials.password,
    });
  }

  async signupWithMobile() {
    await this.prepare();
    await this.signup.signupWithMobileProvider(this.credentials.mobile);
  }

  async verifySignupOtp() {
    await this.otp.verifyProviderSignupOtp(testConfig.testOtp);
  }

  async completeOnboardingSteps({ verifyEmail = false, verifyMobile = false } = {}) {
    await this.personalDetails.complete({
      name: this.credentials.name,
      aboutMe: this.credentials.aboutMe,
      email: this.credentials.email,
      mobile: this.credentials.mobile,
      otp: testConfig.testOtp,
      verifyEmail,
      verifyMobile,
    });

    await this.clinicVisit.fillAndContinue(this.credentials.clinicName);
    await this.insurance.skip();
    await this.workExperience.complete(this.credentials.workExperience);
    await this.education.complete(this.credentials.education);
    await this.certifications.complete(this.credentials.certification);
    await this.compliance.fillMinimumAndContinue();
    await this.skills.addSkillAndContinue(this.credentials.skill);
    await this.stripe.completeMockStripeFlow();
  }

  async assertPendingApproval() {
    await this.pendingApproval.assertOnPage();
  }
}
