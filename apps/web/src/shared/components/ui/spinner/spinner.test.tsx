import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('announces loading only when the caller provides a localized label', () => {
    const { rerender } = render(<Spinner label="Загрузка" />)
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()

    rerender(<Spinner />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts an accessible name through SVG props', () => {
    const name = i18n.t('toast.containerAriaLabel', { ns: 'ui' })
    render(<Spinner label="Загрузка" aria-label={name} />)
    expect(screen.getByRole('status', { name })).toBeInTheDocument()
  })
})
