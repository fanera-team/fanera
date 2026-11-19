import { ElementRenderer, createRectangleElement } from '@/entities/element'
import { useCanvasInteraction } from '../lib/useCanvasInteraction'
import { Stage, Layer } from 'react-konva'

export function BoardCanvas() {
  const { camera, cursor, handlers } = useCanvasInteraction()

  const rect = createRectangleElement({ x: 0, y: 0 })

  return (
    <Stage
      width={800}
      height={600}
      style={{ backgroundColor: 'black' }}
      className={cursor}
      {...handlers}
    >
      <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>
        <ElementRenderer element={rect} />
      </Layer>
    </Stage>
  )
}
