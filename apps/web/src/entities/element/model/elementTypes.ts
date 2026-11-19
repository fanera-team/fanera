export type ElementType = 'shape'
// | 'sticky'
// | 'text'
// | 'image'
// | 'connector'
// | 'group'
// | 'frame'

export type ShapeType = 'rectangle' | 'circle'

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  rotation?: number
}

export interface BaseShape {
  fill?: string
  stroke?: string
}

export interface RectangleShape extends BaseShape {
  shapeType: 'rectangle'
  width: number
  height: number
}

export interface CircleShape extends BaseShape {
  shapeType: 'circle'
  radius: number
}

export type Shape = RectangleShape | CircleShape

export type ShapeElement = BaseElement & Shape

export type Element = ShapeElement
