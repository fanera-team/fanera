import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

function TestMenu({ onRename }: { onRename: () => void }) {
  const { t } = useTranslation('ui')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{t('examples.actions')}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onRename}>{t('examples.rename')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('открывается и вызывает onClick пункта', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<TestMenu onRename={onRename} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }))
    expect(onRename).toHaveBeenCalledTimes(1)
  })

  it('Esc закрывает и возвращает фокус', async () => {
    const user = userEvent.setup()
    render(<TestMenu onRename={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await user.click(trigger)
    await screen.findByRole('menu')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
