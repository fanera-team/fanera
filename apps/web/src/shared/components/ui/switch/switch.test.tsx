import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Label } from '../label/label'
import { Switch } from './switch'

const NAME = 'Тёмная тема'
const BEFORE = 'До'
const AFTER = 'После'

describe('Switch', () => {
  it('переключается по клику и сообщает состояние', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label={NAME} onCheckedChange={onCheckedChange} />)

    const control = screen.getByRole('switch', { name: NAME })
    expect(control).toHaveAttribute('aria-checked', 'false')

    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'true')
    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'false')
    expect(onCheckedChange).toHaveBeenCalledTimes(2)
  })

  it('получает имя от связанной подписи и переключается пробелом', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Label htmlFor="dark-theme">{NAME}</Label>
        <Switch id="dark-theme" />
      </>,
    )

    const control = screen.getByRole('switch', { name: NAME })
    await user.tab()
    expect(control).toHaveFocus()
    await user.keyboard(' ')
    expect(control).toHaveAttribute('aria-checked', 'true')
  })

  it('не изменяется при отключении и пропускается клавишей Tab', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">{BEFORE}</button>
        <Switch aria-label={NAME} disabled defaultChecked />
        <button type="button">{AFTER}</button>
      </>,
    )

    const control = screen.getByRole('switch', { name: NAME })
    expect(control).toHaveAttribute('aria-checked', 'true')
    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('button', { name: BEFORE }))
    await user.tab()
    expect(screen.getByRole('button', { name: AFTER })).toHaveFocus()
  })
})
