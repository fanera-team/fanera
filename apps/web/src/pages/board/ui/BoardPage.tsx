import { BoardCanvas } from '@/features/board-canvas'
import { useCreateShape } from '@/features/create-shape'
import { createRectangleElement, useElementsStore } from '@/entities/element'

function generateElements() {
  const newElements = Array.from({ length: 5000 }, (_, i) =>
    createRectangleElement({
      x: (i % 100) * 30,
      y: Math.floor(i / 100) * 30,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }),
  )

  useElementsStore.setState((state) => ({
    elements: [...state.elements, ...newElements],
  }))
}

export function BoardPage() {
  const { handleCanvasClick } = useCreateShape()

  return (
    <div className="bg-neutral-100 h800 w800 overflow-hidden">
      <button onClick={generateElements}>Создать 5000 элементов</button>
      <BoardCanvas onCanvasClick={handleCanvasClick} />
    </div>
  )
}
