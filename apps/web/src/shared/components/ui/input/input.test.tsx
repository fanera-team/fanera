import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from './input'
import { Label } from '../label/label'

const EMAIL = 'Email'
const EMAIL_ERROR = 'Проверьте адрес почты'

function EmailField({ error, disabled }: { error?: string; disabled?: boolean }) {
  return (
    <div className="flex flex-col">
      <Label htmlFor="email">{EMAIL}</Label>
      <Input
        id="email"
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error ? <p id="email-error">{error}</p> : null}
    </div>
  )
}

describe('Input', () => {
  it('принимает ввод', async () => {
    const user = userEvent.setup()
    render(<EmailField />)

    const input = screen.getByLabelText(EMAIL)
    await user.type(input, 'name@example.com')

    expect(input).toHaveValue('name@example.com')
  })

  it('не принимает ввод, когда поле недоступно', async () => {
    const user = userEvent.setup()
    render(<EmailField disabled />)

    const input = screen.getByLabelText(EMAIL)
    expect(input).toBeDisabled()

    await user.type(input, 'name@example.com')

    expect(input).toHaveValue('')
  })

  it('показывает ошибку валидации и связывает её с полем', () => {
    render(<EmailField error={EMAIL_ERROR} />)

    const input = screen.getByLabelText(EMAIL)

    expect(screen.getByText(EMAIL_ERROR)).toBeVisible()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(EMAIL_ERROR)
  })

  it('не показывает ошибку, пока её нет', () => {
    render(<EmailField />)

    const input = screen.getByLabelText(EMAIL)

    expect(screen.queryByText(EMAIL_ERROR)).not.toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).not.toHaveAttribute('aria-describedby')
  })
})
