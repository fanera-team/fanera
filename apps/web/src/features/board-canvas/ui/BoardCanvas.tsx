import { ElementRenderer, useElementsStore } from '@/entities/element'
import { useCanvasInteraction } from '../lib/useCanvasInteraction'
import { Stage, Layer } from 'react-konva'
import type { Vector2d } from 'konva/lib/types'
import type { KonvaEventObject } from 'konva/lib/Node'
import { getPointerPosition } from '../lib/pointer'
import { useRef } from 'react'
import type { Layer as LayerType } from 'konva/lib/Layer'

interface BoardCanvasProps {
  onCanvasClick: (screenPoint: Vector2d) => void
}

export function BoardCanvas({ onCanvasClick }: BoardCanvasProps) {
  const layerRef = useRef<LayerType | null>(null)
  const { camera, cursor, handlers } = useCanvasInteraction({ layerRef })
  const elements = useElementsStore((state) => state.elements)

  function clickHandle(e: KonvaEventObject<MouseEvent>) {
    const isLeftButton = e.evt.button === 0
    if (!isLeftButton) return
    onCanvasClick(getPointerPosition(e) ?? { x: 0, y: 0 })
  }

  return (
    <Stage
      width={800}
      height={600}
      style={{ backgroundColor: 'black' }}
      className={cursor}
      onClick={clickHandle}
      {...handlers}
    >
      <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale} ref={layerRef}>
        {elements.map((element) => (
          <ElementRenderer element={element} key={element.id} />
        ))}
      </Layer>
    </Stage>
  )
}
