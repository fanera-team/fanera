import { expect, test } from '@playwright/test'
import { authResponseSchema } from '@fanera/contracts'

const mockAuthResponse = authResponseSchema.parse({
  accessToken: 'e2e-access-token',
  expiresIn: 900,
  user: {
    id: '3f2c7b5e-4a1d-4f89-8d21-7c8f10a2b345',
    name: 'E2E User',
    avatarUrl: null,
  },
})

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAuthResponse),
    })
  })
})

test('закрепление Sidebar и Header на странице досок', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/boards')

  const sidebar = page.getByRole('complementary', { name: 'Navigation' })
  await expect(sidebar).toBeVisible()
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Boards' })).toBeVisible()
  await page.getByRole('button', { name: 'User menu' }).click()
  await expect(page.getByText('Demo User')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(sidebar.getByRole('button', { name: 'Unpin sidebar' })).toBeVisible()

  await sidebar.getByRole('button', { name: 'Unpin sidebar' }).click()
  await expect(sidebar.getByRole('button', { name: 'Pin sidebar' })).toBeVisible()
  await sidebar.getByRole('button', { name: 'Pin sidebar' }).click()
  await expect(sidebar.getByRole('button', { name: 'Unpin sidebar' })).toBeVisible()

  await sidebar.getByRole('button', { name: 'Close sidebar' }).click()
  await expect(sidebar).toBeHidden()
  await page.getByRole('button', { name: 'Open sidebar' }).click()
  await expect(sidebar).toBeVisible()
})

test('на узком экране Sidebar открывается и закрывается поверх страницы', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 900 })
  await page.goto('/boards')

  const sidebar = page.getByRole('complementary', { name: 'Navigation' })
  await expect(sidebar).toBeHidden()
  await page.getByRole('button', { name: 'Open sidebar' }).click()
  await expect(sidebar.getByRole('button', { name: 'Pin sidebar' })).toBeVisible()
  await sidebar.getByRole('button', { name: 'Close sidebar' }).click()
  await expect(sidebar).toBeHidden()
})
