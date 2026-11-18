import type { KonvaEventObject } from 'konva/lib/Node'
import type { Vector2d } from 'konva/lib/types'
import { zoomCameraTo } from '../lib/camera'
import { useCanvasStore, type Camera } from '../model/canvas-store'
import { useRef, useState } from 'react'
import { CAMERA_ZOOM_CONFIG } from '../config/camera'
import type { KonvaNodeEvents } from 'react-konva'

type UseCanvasInteractionReturn = {
  camera: Camera
  cursor: string
  handlers: Pick<KonvaNodeEvents, 'onMouseDown' | 'onMouseMove' | 'onMouseUp' | 'onWheel'>
}

export function useCanvasInteraction(): UseCanvasInteractionReturn {
  const camera = useCanvasStore((state) => state.camera)
  const setCamera = useCanvasStore((state) => state.setCamera)

  const [isPanning, setIsPanning] = useState(false)
  const dragStart = useRef<Vector2d>({ x: 0, y: 0 })
  const cameraStart = useRef<Vector2d>({ x: 0, y: 0 })

  function getPointerPosition(e: KonvaEventObject<MouseEvent>) {
    return e.target.getStage()?.getPointerPosition() ?? null
  }

  function handleMouseDown(e: KonvaEventObject<MouseEvent>) {
    const pointerPos = getPointerPosition(e)
    if (!pointerPos) return

    const isMiddleButton = e.evt.button === 1
    if (!isMiddleButton) return

    setIsPanning(true)
    dragStart.current = pointerPos
    cameraStart.current = { ...camera }
  }

  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    if (!isPanning) return

    const pointerPos = getPointerPosition(e)
    if (!pointerPos) return

    const dx = pointerPos.x - dragStart.current.x
    const dy = pointerPos.y - dragStart.current.y

    setCamera({
      ...camera,
      x: cameraStart.current.x + dx,
      y: cameraStart.current.y + dy,
    })
  }

  function handleMouseUp() {
    setIsPanning(false)
  }

  function wheelHandle(e: KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault()

    const pointerPos = getPointerPosition(e)
    if (!pointerPos) return

    const oldScale = camera.scale

    const direction = e.evt.deltaY > 0 ? -1 : 1

    const newScale =
      direction > 0
        ? oldScale * CAMERA_ZOOM_CONFIG.scaleFactor
        : oldScale / CAMERA_ZOOM_CONFIG.scaleFactor

    const clampedScale = Math.max(
      CAMERA_ZOOM_CONFIG.min,
      Math.min(newScale, CAMERA_ZOOM_CONFIG.max),
    )

    setCamera(zoomCameraTo(camera, pointerPos, clampedScale))
  }

  return {
    camera,
    cursor: isPanning ? 'cursor-grab' : 'cursor-default',
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onWheel: wheelHandle,
    },
  }
}
