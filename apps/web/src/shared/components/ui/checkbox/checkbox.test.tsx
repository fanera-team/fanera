import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './checkbox'

const SELECT_BOARD = 'Выбрать доску'
const BEFORE = 'Поле до флажка'
const AFTER = 'Поле после флажка'

describe('Checkbox', () => {
  it('переключается по клику', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label={SELECT_BOARD} />)

    const checkbox = screen.getByRole('checkbox', { name: SELECT_BOARD })
    expect(checkbox).toHaveAttribute('aria-checked', 'false')

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('недоступен: клик не меняет значение, а Tab пропускает флажок', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <button type="button">{BEFORE}</button>
        <Checkbox aria-label={SELECT_BOARD} disabled />
        <button type="button">{AFTER}</button>
      </div>,
    )

    const checkbox = screen.getByRole('checkbox', { name: SELECT_BOARD })
    const before = screen.getByRole('button', { name: BEFORE })
    const after = screen.getByRole('button', { name: AFTER })

    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    expect(checkbox).toHaveAttribute('aria-disabled', 'true')

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'false')

    await user.click(before)
    await user.tab()

    expect(after).toHaveFocus()
    expect(checkbox).not.toHaveFocus()
  })
})
