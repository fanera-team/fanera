import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './checkbox'

const SELECT_BOARD = 'Выбрать доску'

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

  it('не переключается, когда недоступен', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label={SELECT_BOARD} disabled />)

    const checkbox = screen.getByRole('checkbox', { name: SELECT_BOARD })
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })
})
