import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('announces the name and shows its initial', () => {
    render(<Avatar name=" Мария " size="xl" />)

    expect(screen.getByRole('img', { name: 'Мария' })).toHaveTextContent('М')
  })

  it('uses a fallback initial for an empty name', () => {
    render(<Avatar name=" " />)

    expect(screen.getByRole('img')).toHaveTextContent('?')
  })
})
