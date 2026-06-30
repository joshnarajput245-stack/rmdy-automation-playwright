/** UK-style 10-digit mobile numbers for signup/login tests (default country is UK +44). */
export function generateUkMobileNumber() {
  const suffix = Math.floor(Math.random() * 1e9)
    .toString()
    .padStart(9, '0');
  return `7${suffix}`;
}

export function isValidUkMobile(mobile) {
  return /^7\d{9}$/.test(mobile);
}

export function generatePatientEmail() {
  return `patient.${Date.now()}@yopmail.com`;
}

export function generateProviderEmail() {
  return `provider.${Date.now()}@yopmail.com`;
}
