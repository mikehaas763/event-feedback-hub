import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect page to contain the greeting text.
  await expect(page.getByText('Hello Event Feedback Hub')).toBeVisible();
});
