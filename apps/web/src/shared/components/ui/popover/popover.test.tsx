import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'
import { i18n } from '@/shared/lib/i18n'
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from './popover'

function TestPopover() {
  const { t } = useTranslation('ui')
  return (
    <Popover>
      <PopoverTrigger>{t('examples.settings')}</PopoverTrigger>
      <PopoverContent>{t('examples.popoverContent')}</PopoverContent>
    </Popover>
  )
}

describe('Popover', () => {
  it('открывается по клику', async () => {
    const user = userEvent.setup()
    render(<TestPopover />)
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    expect(await screen.findByText('Popover content')).toBeInTheDocument()
  })

  it('Esc закрывает и возвращает фокус', async () => {
    const user = userEvent.setup()
    render(<TestPopover />)
    const trigger = screen.getByRole('button', { name: 'Settings' })
    await user.click(trigger)
    await screen.findByText('Popover content')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Popover content')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('позволяет менять настройку внутри панели', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>{i18n.t('examples.settings', { ns: 'ui' })}</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>{i18n.t('stories.overlays.viewSettings', { ns: 'ui' })}</PopoverTitle>
          <label htmlFor="zoom">{i18n.t('stories.overlays.zoom', { ns: 'ui' })}</label>
          <input id="zoom" defaultValue="100%" />
        </PopoverContent>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    const zoom = await screen.findByRole('textbox', { name: 'Zoom' })
    await user.clear(zoom)
    await user.type(zoom, '125%')
    expect(zoom).toHaveValue('125%')
  })
})
