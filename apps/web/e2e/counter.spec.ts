import { expect, test } from '@playwright/test'

test('the counter works in both languages and remembers the selected language', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByText('Counter: 0')).toBeVisible()
  await page.getByRole('button', { name: 'Increase' }).click()
  await expect(page.getByText('Counter: 1')).toBeVisible()
  await page.getByRole('button', { name: 'Decrease' }).click()
  await expect(page.getByText('Counter: 0')).toBeVisible()

  await page.getByRole('button', { name: 'Русский' }).click()
  await expect(page.getByText('Счётчик: 0')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Русский' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByText('Счётчик: 0')).toBeVisible()
})
