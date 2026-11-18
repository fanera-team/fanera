import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Label } from '../label/label'
import { Textarea } from './textarea'

const DESCRIPTION = 'Описание доски'
const DESCRIPTION_ERROR = 'Слишком длинное описание'

function DescriptionField({ error, disabled }: { error?: string; disabled?: boolean }) {
  return (
    <div className="flex flex-col">
      <Label htmlFor="description">{DESCRIPTION}</Label>
      <Textarea
        id="description"
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'description-error' : undefined}
      />
      {error ? <p id="description-error">{error}</p> : null}
    </div>
  )
}

describe('Textarea', () => {
  it('принимает многострочный ввод', async () => {
    const user = userEvent.setup()
    render(<DescriptionField />)

    const textarea = screen.getByLabelText(DESCRIPTION)
    await user.type(textarea, 'Первая{Enter}Вторая')

    expect(textarea).toHaveValue('Первая\nВторая')
  })

  it('не принимает ввод, когда поле недоступно', async () => {
    const user = userEvent.setup()
    render(<DescriptionField disabled />)

    const textarea = screen.getByLabelText(DESCRIPTION)
    expect(textarea).toBeDisabled()

    await user.type(textarea, 'текст')

    expect(textarea).toHaveValue('')
  })

  it('показывает ошибку валидации и связывает её с полем', () => {
    render(<DescriptionField error={DESCRIPTION_ERROR} />)

    const textarea = screen.getByLabelText(DESCRIPTION)

    expect(screen.getByText(DESCRIPTION_ERROR)).toBeVisible()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAccessibleDescription(DESCRIPTION_ERROR)
  })
})
