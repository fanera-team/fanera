import { useTranslation } from 'react-i18next'
import { Button, Icon, Logo } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

export interface SidebarSpace {
  id: string
  name: string
}

export interface SidebarProps {
  open: boolean
  pinned: boolean
  onClose: () => void
  onPinnedChange: (pinned: boolean) => void
  onHome?: () => void
  onCreateSpace?: () => void
  spaces?: SidebarSpace[]
  onSelectSpace?: (id: string) => void
  className?: string
}

export function Sidebar({
  open,
  pinned,
  onClose,
  onPinnedChange,
  onHome,
  onCreateSpace,
  spaces = [],
  onSelectSpace,
  className,
}: SidebarProps) {
  const { t } = useTranslation('ui')

  if (!open) return null

  return (
    <aside
      id="app-sidebar"
      aria-label={t('navigation.sidebar')}
      data-pinned={pinned}
      className={cn(
        'border-border bg-sidebar text-sidebar-foreground w-63 flex h-dvh shrink-0 flex-col border-r',
        className,
      )}
    >
      <div className="h-18 border-border px-4 flex items-center justify-between border-b">
        <Logo size={24} kind="lockup" />
        <div className="gap-1 flex items-center">
          <Button
            variant="ghost"
            size="icon-s"
            className="size-9"
            aria-label={t(pinned ? 'navigation.unpinSidebar' : 'navigation.pinSidebar')}
            aria-pressed={pinned}
            onClick={() => onPinnedChange(!pinned)}
          >
            <Icon name={pinned ? 'pin-off' : 'pin'} size="s" />
          </Button>
          <Button
            variant="ghost"
            size="icon-s"
            className="size-9"
            aria-label={t('navigation.closeSidebar')}
            onClick={onClose}
          >
            <Icon name="x" size="s" />
          </Button>
        </div>
      </div>

      <nav
        className="min-h-0 gap-4 p-4 flex flex-1 flex-col overflow-y-auto"
        aria-label={t('navigation.sidebar')}
      >
        <Button variant="ghost" className="justify-start" disabled={!onHome} onClick={onHome}>
          <Icon name="home" />
          {t('navigation.home')}
        </Button>
        <div className="gap-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {t('navigation.spaces')}
          </span>
          <Button
            variant="primary"
            size="icon-m"
            aria-label={t('navigation.createSpace')}
            disabled={!onCreateSpace}
            onClick={onCreateSpace}
          >
            <Icon name="plus" />
          </Button>
        </div>
        {spaces.length > 0 && (
          <ul className="gap-1 flex flex-col">
            {spaces.map((space) => (
              <li key={space.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left"
                  disabled={!onSelectSpace}
                  onClick={() => onSelectSpace?.(space.id)}
                >
                  <span className="truncate">{space.name}</span>
                  <Icon name="chevron-right" size="s" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  )
}
