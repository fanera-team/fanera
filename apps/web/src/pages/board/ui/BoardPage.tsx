import { BoardCanvas } from '@/features/board-canvas'

export function BoardPage() {
  return (
    <div className="bg-neutral-100 h800 w800 overflow-hidden">
      <BoardCanvas />
    </div>
  )
}
