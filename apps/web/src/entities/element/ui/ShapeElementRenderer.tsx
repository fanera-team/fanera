import { Circle, Rect } from 'react-konva'
import type { ShapeElement } from '../model/elementTypes'

interface ShapeElementRendererProps {
  shapeElement: ShapeElement
}

export function ShapeElementRenderer({ shapeElement }: ShapeElementRendererProps) {
  switch (shapeElement.shapeType) {
    case 'rectangle':
      return (
        <Rect
          x={shapeElement.x}
          y={shapeElement.y}
          width={shapeElement.width}
          height={shapeElement.height}
          fill={shapeElement.fill}
          stroke={shapeElement.stroke}
          rotation={shapeElement.rotation}
        />
      )
    case 'circle':
      return (
        <Circle
          x={shapeElement.x}
          y={shapeElement.y}
          radius={shapeElement.radius}
          fill={shapeElement.fill}
          stroke={shapeElement.stroke}
          rotation={shapeElement.rotation}
        />
      )
    default:
      shapeElement satisfies never
      return null
  }
}
