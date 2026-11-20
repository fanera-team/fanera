import { expect, test } from '@playwright/test'

test('закрепление Sidebar и контролы на демонстрационной странице', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Navigation' })
  await expect(sidebar).toBeVisible()
  await expect(sidebar.getByRole('button', { name: 'Unpin sidebar' })).toBeVisible()

  await sidebar.getByRole('button', { name: 'Unpin sidebar' }).click()
  await expect(sidebar.getByRole('button', { name: 'Pin sidebar' })).toBeVisible()
  await sidebar.getByRole('button', { name: 'Pin sidebar' }).click()
  await expect(sidebar.getByRole('button', { name: 'Unpin sidebar' })).toBeVisible()

  await sidebar.getByRole('button', { name: 'Close sidebar' }).click()
  await expect(sidebar).toBeHidden()
  await page.getByRole('button', { name: 'Open sidebar' }).click()
  await expect(sidebar).toBeVisible()

  const toolbar = page.getByRole('toolbar', { name: 'Board tools' })
  await toolbar.getByRole('button', { name: 'Sticky note' }).click()
  await expect(toolbar.getByRole('button', { name: 'Sticky note' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('radio', { name: 'Pink' }).check()
  await expect(page.getByRole('radio', { name: 'Pink' })).toBeChecked()
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await expect(page.getByText('125%')).toBeVisible()

  await page.getByRole('tab', { name: 'Components' }).click()
  await expect(page.getByRole('button', { name: 'Create board' })).toBeVisible()
})

test('на узком экране Sidebar открывается и закрывается поверх страницы', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 900 })
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Navigation' })
  await expect(sidebar).toBeHidden()
  await page.getByRole('button', { name: 'Open sidebar' }).click()
  await expect(sidebar.getByRole('button', { name: 'Pin sidebar' })).toBeVisible()
  await sidebar.getByRole('button', { name: 'Close sidebar' }).click()
  await expect(sidebar).toBeHidden()
})
