export const testConfig = {
  baseUrl: process.env.BASE_URL || 'https://dev-user.rmdyroom.com',
  testOtp: process.env.TEST_OTP || '1234',
  providerPassword: process.env.TEST_PROVIDER_PASSWORD || 'Test@1234',
};

export function hasOtpConfig() {
  return Boolean(testConfig.testOtp && /^\d{4}$/.test(testConfig.testOtp));
}
