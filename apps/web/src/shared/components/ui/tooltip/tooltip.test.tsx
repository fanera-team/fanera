import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useTranslation } from 'react-i18next'
import '@/shared/lib/i18n'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

function TestTooltip() {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(true)
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger>{t('examples.hover')}</TooltipTrigger>
        <TooltipContent>{t('examples.tooltip')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function UncontrolledTestTooltip() {
  const { t } = useTranslation('ui')
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{t('examples.hover')}</TooltipTrigger>
        <TooltipContent>{t('examples.tooltip')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe('Tooltip', () => {
  it('рендерит подсказку в открытом состоянии', async () => {
    render(<TestTooltip />)
    expect(await screen.findByText('Tooltip')).toBeInTheDocument()
  })

  it('закрывается по Esc', async () => {
    const user = userEvent.setup()
    render(<TestTooltip />)
    await screen.findByText('Tooltip')
    await user.tab()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Tooltip')).not.toBeInTheDocument())
  })

  it('открывается по Tab и закрывается по Esc, сохраняя фокус на триггере', async () => {
    const user = userEvent.setup()
    render(<UncontrolledTestTooltip />)
    expect(screen.queryByText('Tooltip')).not.toBeInTheDocument()

    await user.tab()
    const trigger = screen.getByRole('button', { name: 'Hover' })
    expect(trigger).toHaveFocus()
    expect(await screen.findByText('Tooltip')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Tooltip')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })
})
