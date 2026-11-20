import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '../input/input'
import { Label } from './label'

const EMAIL = 'Email'

describe('Label', () => {
  it('показывает текст подписи', () => {
    render(<Label htmlFor="email">{EMAIL}</Label>)

    expect(screen.getByText(EMAIL)).toBeVisible()
  })

  it('связывает подпись с полем', () => {
    render(
      <>
        <Label htmlFor="email">{EMAIL}</Label>
        <Input id="email" />
      </>,
    )

    expect(screen.getByLabelText(EMAIL)).toBeInstanceOf(HTMLInputElement)
  })

  it('помечает обязательное поле, сохраняя доступное имя без звёздочки', () => {
    render(
      <>
        <Label htmlFor="email" required>
          {EMAIL}
        </Label>
        <Input id="email" required />
      </>,
    )

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('textbox', { name: EMAIL })).toBeRequired()
  })
})
