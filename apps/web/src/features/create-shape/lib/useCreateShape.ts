import { screenToWorld, useCanvasStore } from '@/entities/canvas'
import { createRectangleElement, useElementsStore } from '@/entities/element'
import type { Vector2d } from 'konva/lib/types'

export function useCreateShape() {
  const camera = useCanvasStore((state) => state.camera)
  const addElement = useElementsStore((state) => state.addElement)

  function handleCanvasClick(screenPoint: Vector2d) {
    const worldPoint = screenToWorld(camera, screenPoint.x, screenPoint.y)
    addElement(createRectangleElement({ x: worldPoint.x, y: worldPoint.y }))
  }

  return { handleCanvasClick }
}
