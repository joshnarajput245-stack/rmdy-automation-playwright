import { generateUkMobileNumber } from './phoneHelper.js';

export function createProviderCredentials() {
  const stamp = Date.now();
  return {
    email: `provider.${stamp}@yopmail.com`,
    mobile: generateUkMobileNumber(),
    password: 'Test@1234',
    name: `Provider Test ${stamp}`,
    aboutMe: 'Automated provider onboarding test profile.',
    clinicName: 'Automation Clinic',
    skill: 'General Practice',
    workExperience: {
      position: 'General Practitioner',
      companyName: 'Automation Health',
      description: 'Automated work experience entry for E2E tests.',
    },
    education: {
      degree: 'MBBS',
      schoolName: 'Automation Medical School',
    },
    certification: {
      name: 'Medical License',
      schoolName: 'Automation Board',
    },
  };
}
