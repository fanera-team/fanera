import { fireEvent, render, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { BoardTool } from '@/shared/components/ui'
import { useBoardToolShortcuts } from './use-board-tool-shortcuts'

describe('useBoardToolShortcuts', () => {
  it('отдаёт инструменты по V, S, T, R, A и возвращает выбор по Escape', () => {
    const onToolChange = vi.fn()
    const { rerender } = renderHook(
      ({ activeTool }) => useBoardToolShortcuts({ activeTool, onToolChange }),
      { initialProps: { activeTool: 'select' as BoardTool } },
    )

    for (const [code, tool] of [
      ['KeyS', 'sticky'],
      ['KeyT', 'text'],
      ['KeyR', 'shape'],
      ['KeyA', 'arrow'],
    ] as const) {
      fireEvent.keyDown(window, { code })
      expect(onToolChange).toHaveBeenLastCalledWith(tool)
    }

    rerender({ activeTool: 'sticky' })
    fireEvent.keyDown(window, { code: 'KeyV' })
    expect(onToolChange).toHaveBeenLastCalledWith('select')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onToolChange).toHaveBeenLastCalledWith('select')
  })

  it('не перехватывает ввод, модификаторы и недоступные инструменты', () => {
    const onToolChange = vi.fn()
    const { container } = render(<input />)
    const input = container.querySelector('input')!
    const { rerender } = renderHook(
      ({ enabled }) =>
        useBoardToolShortcuts({
          activeTool: 'select',
          onToolChange,
          enabled,
          disabledTools: ['arrow'],
        }),
      { initialProps: { enabled: true } },
    )

    fireEvent.keyDown(input, { code: 'KeyS' })
    fireEvent.keyDown(window, { code: 'KeyS', ctrlKey: true })
    fireEvent.keyDown(window, { code: 'KeyS', repeat: true })
    fireEvent.keyDown(window, { code: 'KeyA' })
    fireEvent.keyDown(window, { code: 'KeyV' })
    expect(onToolChange).not.toHaveBeenCalled()

    rerender({ enabled: false })
    fireEvent.keyDown(window, { code: 'KeyS' })
    expect(onToolChange).not.toHaveBeenCalled()
  })
})
