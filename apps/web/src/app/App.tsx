import { Counter } from '@/features/counter'
import { LanguageToggle, Logo, ThemeToggle } from '@/shared/components/ui'
import { Toaster } from '@/shared/components/ui/sonner/sonner'
import { TooltipProvider } from '@/shared/components/ui/tooltip/tooltip'

function App() {
  return (
    <TooltipProvider>
      <main className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <div className="gap-8 flex flex-col justify-between">
          <div className="gap-4 flex flex-wrap items-center justify-between">
            <h1>
              <Logo kind="lockup" size={48} />
            </h1>
            <div className="gap-4 flex items-center justify-between">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Counter />
          </div>
        </div>
      </main>
      <Toaster />
    </TooltipProvider>
  )
}

export default App
