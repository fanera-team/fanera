import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

const CREATE = 'Создать доску'
const UNAVAILABLE = 'Недоступно'

function BoardForm({ loading, onConfirm }: { loading: boolean; onConfirm: () => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onConfirm()
      }}
    >
      <Button type="submit" loading={loading}>
        {CREATE}
      </Button>
    </form>
  )
}

describe('Button в форме', () => {
  it('не отправляет форму, пока кнопка в состоянии загрузки', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const { rerender } = render(<BoardForm loading onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: CREATE }))
    expect(onConfirm).not.toHaveBeenCalled()

    rerender(<BoardForm loading={false} onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: CREATE }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})

describe('Button', () => {
  it('вызывает обработчик клика', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>{CREATE}</Button>)
    await user.click(screen.getByRole('button', { name: CREATE }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('не вызывает обработчик, когда кнопка недоступна', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        {UNAVAILABLE}
      </Button>,
    )
    const button = screen.getByRole('button', { name: UNAVAILABLE })

    expect(button).toBeDisabled()
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('во время загрузки блокирует клик и сообщает о состоянии', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button loading onClick={onClick}>
        {CREATE}
      </Button>,
    )
    const button = screen.getByRole('button', { name: CREATE })

    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')

    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })
})
