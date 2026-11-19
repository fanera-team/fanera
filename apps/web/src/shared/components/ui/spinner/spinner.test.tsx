import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('announces loading only when the caller provides a localized label', () => {
    const { rerender } = render(<Spinner label="Загрузка" />)
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()

    rerender(<Spinner />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it.each([16, 24, 32, 40, 48] as const)('renders a hollow ring at %i px', (size) => {
    const { container } = render(<Spinner size={size} />)
    const svg = container.querySelector('svg')
    const circles = [...container.querySelectorAll('circle')]

    expect(svg).toHaveAttribute('width', String(size))
    expect(svg).toHaveAttribute('height', String(size))
    expect(circles).toHaveLength(2)
    expect(circles.every((circle) => circle.getAttribute('fill') === 'none')).toBe(true)
    expect(circles[1]).toHaveAttribute('stroke', 'var(--primary)')
    expect(circles[1].getAttribute('stroke-dasharray')).toMatch(/^\d/)
  })
})
