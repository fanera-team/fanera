import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/shared/lib/theme-store'
import { Moon, Sun } from 'lucide-react'
import { Icon } from './icon'
import { SegmentedToggle } from './segmented-toggle'

export function ThemeToggle() {
  const { t } = useTranslation('ui')
  const theme = useThemeStore((state) => state.theme)
  const changeTheme = useThemeStore((state) => state.changeTheme)

  return (
    <SegmentedToggle
      value={theme}
      options={[
        { value: 'light', label: t('theme.light'), content: <Icon icon={Sun} size="md" /> },
        { value: 'dark', label: t('theme.dark'), content: <Icon icon={Moon} size="md" /> },
      ]}
      onValueChange={changeTheme}
    />
  )
}
