import { Counter } from '@/features/counter'
import { BoardPage } from '@/pages/board'

function App() {
  return (
    <main className="bg-neutral-600 flex min-h-screen items-center justify-center">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-white underline">Tailwind работает!</h1>
        <div className="mt-4">
          <Counter />
          <BoardPage />
        </div>
      </div>
    </main>
  )
}

export default App
