import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/shared/lib/theme-store'
import { Icon } from '../icon/icon'
import { SegmentedToggle } from '../segmented-toggle/segmented-toggle'

export function ThemeToggle() {
  const { t } = useTranslation('ui')
  const theme = useThemeStore((state) => state.theme)
  const changeTheme = useThemeStore((state) => state.changeTheme)

  return (
    <SegmentedToggle
      value={theme}
      options={[
        { value: 'light', label: t('theme.light'), content: <Icon name="sun" size="m" /> },
        { value: 'dark', label: t('theme.dark'), content: <Icon name="moon" size="m" /> },
      ]}
      onValueChange={changeTheme}
    />
  )
}
