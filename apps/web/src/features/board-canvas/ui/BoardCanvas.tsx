import { useCanvasInteraction } from '../lib/useCanvasInteraction'
import { Stage, Layer, Rect } from 'react-konva'

export function BoardCanvas() {
  const { camera, cursor, handlers } = useCanvasInteraction()

  return (
    <Stage
      width={800}
      height={600}
      style={{ backgroundColor: 'black' }}
      className={cursor}
      {...handlers}
    >
      <Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>
        <Rect width={30} height={30} id="1" fill={'yellow'} />
      </Layer>
    </Stage>
  )
}
