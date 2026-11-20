import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export const Small: Story = { render: () => <Example size="s" /> }
export const Medium: Story = { render: () => <Example size="m" /> }
export const Large: Story = { render: () => <Example size="l" /> }
export const ContentHeight: Story = { render: () => <Example size="m" autoHeight /> }
export const NonModal: Story = { render: () => <Example size="m" modal={false} /> }
export const OutsideClickDisabled: Story = {
  render: () => <Example size="m" closeOnOutsideClick={false} />,
}
export const Draggable: Story = { render: () => <Example size="m" draggable /> }
export const FooterActions: Story = { render: () => <Example size="m" actions /> }

function Example({
  size,
  autoHeight,
  modal,
  closeOnOutsideClick,
  draggable,
  actions,
}: {
  size: 's' | 'm' | 'l'
  autoHeight?: boolean
  modal?: boolean
  closeOnOutsideClick?: boolean
  draggable?: boolean
  actions?: boolean
}) {
  const { t } = useTranslation('ui')
  return (
    <Dialog modal={modal} closeOnOutsideClick={closeOnOutsideClick}>
      <DialogTrigger render={<Button variant="outline" />}>{t('examples.open')}</DialogTrigger>
      <DialogContent
        size={size}
        autoHeight={autoHeight}
        draggable={draggable}
        footerActions={
          actions
            ? [
                { label: t('confirmDialog.cancel'), variant: 'outline', onClick: () => {} },
                { label: t('confirmDialog.confirm'), onClick: () => {} },
              ]
            : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>{t('examples.title')}</DialogTitle>
          <DialogDescription>{t('examples.description')}</DialogDescription>
        </DialogHeader>
        {!actions && <DialogFooter showCloseButton />}
      </DialogContent>
    </Dialog>
  )
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
