import { ShapeElementRenderer } from './ShapeElementRenderer'
import type { Element } from '../model/elementTypes'

interface ElementRendererProps {
  element: Element
}

export function ElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    case 'shape':
      return <ShapeElementRenderer shapeElement={element} />
    default: {
      element.type satisfies never
      return null
    }
  }
}
