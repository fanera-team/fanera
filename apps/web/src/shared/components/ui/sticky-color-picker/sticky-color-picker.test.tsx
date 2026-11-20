import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/shared/lib/i18n'
import { StickyColorPicker } from './sticky-color-picker'

beforeAll(async () => {
  await i18n.changeLanguage('ru')
})

describe('StickyColorPicker', () => {
  it('показывает фиксированную палитру и отдаёт выбранный цвет', async () => {
    const user = userEvent.setup()
    const onColorChange = vi.fn()
    const { rerender } = render(
      <StickyColorPicker selectedColor="yellow" onColorChange={onColorChange} />,
    )

    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.getByRole('radio', { name: 'Жёлтый' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'Синий' }))
    expect(onColorChange).toHaveBeenCalledWith('blue')

    rerender(<StickyColorPicker selectedColor="blue" onColorChange={onColorChange} />)
    expect(screen.getByRole('radio', { name: 'Синий' })).toBeChecked()
  })

  it('не отдаёт событие в недоступном состоянии', async () => {
    const user = userEvent.setup()
    const onColorChange = vi.fn()
    render(<StickyColorPicker selectedColor="yellow" onColorChange={onColorChange} disabled />)

    const blue = screen.getByRole('radio', { name: 'Синий' })
    expect(blue).toBeDisabled()
    await user.click(blue)
    expect(onColorChange).not.toHaveBeenCalled()
  })
})
