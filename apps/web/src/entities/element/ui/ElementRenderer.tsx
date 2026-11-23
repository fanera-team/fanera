import { ShapeElementRenderer } from './ShapeElementRenderer'
import type { Element } from '../model/elementTypes'
import { memo } from 'react'

interface ElementRendererProps {
  element: Element
}

export const ElementRenderer = memo(({ element }: ElementRendererProps) => {
  switch (element.type) {
    case 'shape':
      return <ShapeElementRenderer shapeElement={element} />
    default: {
      element.type satisfies never
      return null
    }
  }
})
