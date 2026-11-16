import { expect, test } from '@playwright/test'

test('the counter works in both languages and remembers the selected language', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('combobox').selectOption('en')
  await expect(page.getByText('Counter: 0')).toBeVisible()
  await page.getByRole('button', { name: 'Increase' }).click()
  await expect(page.getByText('Counter: 1')).toBeVisible()
  await page.getByRole('button', { name: 'Decrease' }).click()
  await expect(page.getByText('Counter: 0')).toBeVisible()

  await page.getByRole('combobox').selectOption('ru')
  await expect(page.getByText('Счётчик: 0')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('combobox')).toHaveValue('ru')
  await expect(page.getByText('Счётчик: 0')).toBeVisible()
})
