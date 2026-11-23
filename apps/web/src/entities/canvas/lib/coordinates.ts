import type { Vector2d } from 'konva/lib/types'
import type { Camera } from '../model/canvas-store'

export function screenToWorld(camera: Camera, screenX: number, screenY: number): Vector2d {
  return {
    x: (screenX - camera.x) / camera.scale,
    y: (screenY - camera.y) / camera.scale,
  }
}

export function worldToScreen(camera: Camera, worldX: number, worldY: number): Vector2d {
  return {
    x: camera.x + worldX * camera.scale,
    y: camera.y + worldY * camera.scale,
  }
}
