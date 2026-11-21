import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs } from './tabs'

const options = [
  { value: 'first', label: 'Первая', content: 'Содержимое первой' },
  { value: 'second', label: 'Вторая', content: 'Содержимое второй' },
  { value: 'third', label: 'Третья', content: 'Содержимое третьей', disabled: true },
] as const

function ControlledTabs({ onValueChange = () => {} }: { onValueChange?: (value: string) => void }) {
  const [value, setValue] = useState<string>('first')

  return (
    <Tabs
      label="Разделы"
      value={value}
      options={options}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        onValueChange(nextValue)
      }}
    />
  )
}

describe('Tabs', () => {
  it('показывает выбранную панель и переключается по нажатию', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ControlledTabs onValueChange={onValueChange} />)

    const tablist = screen.getByRole('tablist', { name: 'Разделы' })
    const first = screen.getByRole('tab', { name: 'Первая' })
    const second = screen.getByRole('tab', { name: 'Вторая' })
    expect(tablist).toContainElement(first)
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Содержимое первой')

    await user.click(second)
    expect(onValueChange).toHaveBeenCalledWith('second')
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Содержимое второй')
    expect(second).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id)
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', second.id)
  })

  it('переключает стрелками, Home и End, пропуская недоступную вкладку', async () => {
    const user = userEvent.setup()
    render(<ControlledTabs />)

    const first = screen.getByRole('tab', { name: 'Первая' })
    const second = screen.getByRole('tab', { name: 'Вторая' })
    const third = screen.getByRole('tab', { name: 'Третья' })
    await user.tab()
    expect(first).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(second).toHaveFocus()
    expect(second).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowRight}')
    expect(first).toHaveFocus()
    expect(third).toBeDisabled()
    await user.keyboard('{End}')
    expect(second).toHaveFocus()
    await user.keyboard('{Home}')
    expect(first).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(second).toHaveFocus()
  })

  it('не активирует недоступную вкладку по нажатию', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ControlledTabs onValueChange={onValueChange} />)

    await user.click(screen.getByRole('tab', { name: 'Третья' }))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole('tab', { name: 'Третья' })).toHaveAttribute('aria-selected', 'false')
  })
})
