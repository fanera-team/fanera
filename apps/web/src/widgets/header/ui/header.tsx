import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  LanguageToggle,
  Logo,
  ThemeToggle,
} from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

export interface HeaderUser {
  name: string
  email: string
}

export interface HeaderProps {
  sidebarOpen: boolean
  onOpenSidebar: () => void
  user: HeaderUser
  onProfile?: () => void
  onSettings?: () => void
  onSignOut?: () => void
  className?: string
}

export function Header({
  sidebarOpen,
  onOpenSidebar,
  user,
  onProfile,
  onSettings,
  onSignOut,
  className,
}: HeaderProps) {
  const { t } = useTranslation('ui')

  return (
    <header
      className={cn(
        'border-border bg-background h-18 px-4 flex w-full items-center justify-between border-b',
        className,
      )}
    >
      <div className="min-w-0 gap-3 flex items-center">
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon-m"
            aria-label={t('navigation.openSidebar')}
            aria-controls="app-sidebar"
            aria-expanded={false}
            onClick={onOpenSidebar}
          >
            <Icon name="menu" />
          </Button>
        )}
        <Logo size={24} kind="lockup" />
      </div>

      <div className="gap-3 flex items-center">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-m" aria-label={t('navigation.userMenu')} />}
          >
            <Avatar name={user.name} size="m" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[min(360px,calc(100vw-16px))]">
            <div className="gap-3 px-3 py-2 flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <LanguageToggle />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!onProfile} onClick={onProfile}>
              <Icon name="user-round" size="s" />
              {t('navigation.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!onSettings} onClick={onSettings}>
              <Icon name="settings" size="s" />
              {t('navigation.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!onSignOut} onClick={onSignOut}>
              <Icon name="log-out" size="s" />
              {t('navigation.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
