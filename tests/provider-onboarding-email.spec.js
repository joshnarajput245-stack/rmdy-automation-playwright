import { test } from '@playwright/test';
import ProviderOnboardingFlow from '../Pages/provider/ProviderOnboardingFlow.js';
import { hasOtpConfig } from '../utils/testConfig.js';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });
test.setTimeout(600000);

test.describe('Provider onboarding - email signup', () => {
  test('completes full provider onboarding to pending approval', async ({ page }) => {
    test.skip(!hasOtpConfig(), 'Set TEST_OTP to the 4-digit dev environment OTP');

    const flow = new ProviderOnboardingFlow(page);

    await flow.signupWithEmail();
    await flow.verifySignupOtp();
    await flow.completeOnboardingSteps({ verifyEmail: false, verifyMobile: true });
    await flow.assertPendingApproval();
  });
});
