import { DEFAULT_RECTANGLE_SHAPE } from '../config/elementDefaults'
import type { ShapeElement } from '../model/elementTypes'

type CreateRectangleElementParams = {
  x: number
  y: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  rotation?: number
}

export function createRectangleElement(params: CreateRectangleElementParams): ShapeElement {
  const { x, y, fill, height, rotation, stroke, width } = params
  return {
    id: crypto.randomUUID(),
    type: 'shape',
    shapeType: 'rectangle',
    x: x,
    y: y,
    width: width ?? DEFAULT_RECTANGLE_SHAPE.width,
    height: height ?? DEFAULT_RECTANGLE_SHAPE.height,
    fill: fill ?? DEFAULT_RECTANGLE_SHAPE.fill,
    stroke: stroke ?? DEFAULT_RECTANGLE_SHAPE.stroke,
    rotation: rotation ?? 0,
  }
}
