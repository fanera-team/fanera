import type { KonvaEventObject } from 'konva/lib/Node'
import type { Vector2d } from 'konva/lib/types'

export function getPointerPosition(e: KonvaEventObject<MouseEvent>): Vector2d | null {
  return e.currentTarget.getStage()?.getPointerPosition() ?? null
}
