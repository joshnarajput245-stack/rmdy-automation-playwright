/**
 * Fill MUI DatePicker inside a scoped container (format MM/DD/YYYY).
 * Uses force-fill to avoid the calendar icon button intercepting clicks.
 */
export async function fillDatePickerInScope(scope, page, label, value) {
  const field = scope.getByRole('textbox', { name: new RegExp(label, 'i') }).first();
  await field.fill(value, { force: true });
  await page.keyboard.press('Tab');
}

/**
 * Fill MUI DatePicker text field (format MM/DD/YYYY).
 */
export async function fillDatePicker(page, label, value) {
  await fillDatePickerInScope(page, page, label, value);
}

/**
 * Select a single-value MUI select by visible label text.
 */
export async function selectByLabel(page, label, optionText) {
  const field = page.getByLabel(label, { exact: false }).first();
  await field.click();
  await page.getByRole('option', { name: optionText, exact: true }).click();
}

/**
 * Pick the first available option from a multi-select field.
 */
export async function selectFirstMultiSelectOption(page, label) {
  await page.waitForResponse(
    (response) =>
      response.request().method() !== 'OPTIONS' && response.url().includes('categories'),
    { timeout: 60000 },
  ).catch(() => {});

  const field = page.getByLabel(label, { exact: false }).first();
  await field.click();

  const listbox = page.getByRole('listbox');
  await listbox.waitFor({ state: 'visible', timeout: 15000 });

  const firstOption = listbox.getByRole('option').filter({ hasNotText: 'Select' }).first();
  await firstOption.waitFor({ state: 'visible', timeout: 15000 });
  await firstOption.click();
  await page.keyboard.press('Escape');
}

/**
 * Select visit types from the clinic page multi-select (no field label).
 */
export async function selectVisitTypesByLabel(page, labels) {
  const visitSelect = page.locator('.MuiSelect-select').filter({ hasText: /Select Visit|Home|Online|Clinic/i }).first();
  await visitSelect.click();

  for (const label of labels) {
    const item = page.getByRole('option', { name: new RegExp(label, 'i') }).first();
    if (await item.isVisible().catch(() => false)) {
      await item.click();
    }
  }

  await page.keyboard.press('Escape');
}

/**
 * Toggle a MUI switch by its label text.
 */
export async function toggleSwitchByLabel(scope, label) {
  const switchControl = scope.getByRole('checkbox', { name: label });
  if (await switchControl.isVisible().catch(() => false)) {
    await switchControl.check();
    return;
  }
  await scope.getByText(label, { exact: true }).click();
}
