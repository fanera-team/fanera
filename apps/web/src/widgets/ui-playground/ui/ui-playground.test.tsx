import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import '@/shared/lib/i18n'
import { UiPlayground } from './ui-playground'

describe('UiPlayground', () => {
  it('связывает контролы доски и показывает другие компоненты во второй вкладке', async () => {
    const user = userEvent.setup()
    render(<UiPlayground />)

    await user.click(screen.getByRole('button', { name: 'Sticky note' }))
    expect(screen.getByRole('button', { name: 'Sticky note' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('radio', { name: 'Pink' }))
    expect(screen.getByRole('radio', { name: 'Pink' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByText('125%')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Components' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select all boards' }))
    expect(screen.getByRole('checkbox', { name: 'Select all boards' })).toBeChecked()
  })
})
