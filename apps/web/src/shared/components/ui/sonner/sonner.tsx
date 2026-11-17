import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/shared/lib/theme-store'

export function Toaster(props: ToasterProps) {
  const { t } = useTranslation('ui')
  const theme = useThemeStore((state) => state.theme)

  return (
    <Sonner
      containerAriaLabel={t('toast.containerAriaLabel')}
      theme={theme}
      richColors
      position="bottom-right"
      className="toaster group"
      {...props}
    />
  )
}
