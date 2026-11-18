import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Button } from '../button/button'
import { useTranslation } from 'react-i18next'

const meta = {
  title: 'Shared/UI/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <BasicDialog />,
}

function BasicDialog() {
  const { t } = useTranslation('ui')
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>{t('examples.open')}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('examples.title')}</DialogTitle>
          <DialogDescription>{t('examples.description')}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
