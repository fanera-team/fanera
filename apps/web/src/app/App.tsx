import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Toaster, TooltipProvider } from '@/shared/components/ui'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { UiPlayground } from '@/widgets/ui-playground'

function isDesktopWidth() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(min-width: 1024px)').matches
  )
}

function App() {
  const { t } = useTranslation('ui')
  const [sidebarOpen, setSidebarOpen] = useState(isDesktopWidth)
  const [sidebarPinned, setSidebarPinned] = useState(isDesktopWidth)
  const sidebarOverlay = sidebarOpen && !sidebarPinned

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground relative flex min-h-screen">
        {sidebarOverlay && (
          <button
            type="button"
            aria-label={t('navigation.closeSidebar')}
            className="bg-foreground/20 inset-0 fixed z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          open={sidebarOpen}
          pinned={sidebarPinned}
          onClose={() => setSidebarOpen(false)}
          onPinnedChange={setSidebarPinned}
          className={sidebarOverlay ? 'inset-y-0 left-0 fixed z-20' : 'top-0 sticky'}
        />
        <div className="min-w-0 flex min-h-screen flex-1 flex-col">
          <Header
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
            user={{ name: 'Demo User', email: 'demo@example.com' }}
          />
          <main className="min-w-0 flex-1">
            <UiPlayground />
          </main>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}

export default App
