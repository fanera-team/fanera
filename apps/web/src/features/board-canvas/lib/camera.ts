import { screenToWorld, type Camera } from '@/entities/canvas'
import type { Vector2d } from 'konva/lib/types'

export function zoomCameraTo(camera: Camera, pointer: Vector2d, newScale: number): Camera {
  const worldPoint = screenToWorld(camera, pointer.x, pointer.y)

  return {
    x: pointer.x - worldPoint.x * newScale,
    y: pointer.y - worldPoint.y * newScale,
    scale: newScale,
  }
}
