export async function scrollIntoCenter(locator) {
  await locator.evaluate((el) =>
    el.scrollIntoView({ block: 'center', inline: 'nearest' }),
  );
}
