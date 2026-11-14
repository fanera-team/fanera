import { expect, test } from '@playwright/test'

test('the counter works in the browser', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Count: 0')).toBeVisible()
  await page.getByRole('button', { name: 'increment' }).click()
  await expect(page.getByText('Count: 1')).toBeVisible()
  await page.getByRole('button', { name: 'decrement' }).click()
  await expect(page.getByText('Count: 0')).toBeVisible()
})
