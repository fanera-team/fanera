import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon } from './icon'

describe('Icon', () => {
  it('keeps decorative glyphs out of the accessibility tree', () => {
    const { container } = render(<Icon name="plus" />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
