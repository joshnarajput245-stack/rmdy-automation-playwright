import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TEST_AVATAR_PATH = path.resolve(__dirname, '../fixtures/test-avatar.png');

export async function uploadFileInput(page, selector, filePath = TEST_AVATAR_PATH) {
  await page.locator(selector).setInputFiles(filePath);
}

export async function uploadAndWait(page, selector, filePath = TEST_AVATAR_PATH) {
  const uploadPromise = page.waitForResponse(
    (response) =>
      response.request().method() !== 'OPTIONS' &&
      response.url().includes('presigned-url'),
    { timeout: 90000 },
  ).catch(() => null);

  await uploadFileInput(page, selector, filePath);
  await uploadPromise;
}
