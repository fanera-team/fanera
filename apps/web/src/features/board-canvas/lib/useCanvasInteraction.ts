import type { KonvaEventObject } from 'konva/lib/Node'
import type { Vector2d } from 'konva/lib/types'
import { zoomCameraTo } from '../lib/camera'
import type { Layer as LayerType } from 'konva/lib/Layer'
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { CAMERA_THROTTLE_MS, CAMERA_ZOOM_CONFIG, CAMERA_THROTTLE_OPTIONS } from '../config/camera'
import type { KonvaNodeEvents } from 'react-konva'
import { useCanvasStore, type Camera } from '@/entities/canvas'
import { getPointerPosition } from '../lib/pointer'
import { throttle } from '@/shared/lib/throttle'

type UseCanvasInteractionReturn = {
  camera: Camera
  cursor: string
  handlers: Pick<
    KonvaNodeEvents,
    'onMouseDown' | 'onMouseMove' | 'onMouseUp' | 'onMouseLeave' | 'onWheel'
  >
}

interface UseCanvasInteractionParams {
  layerRef: RefObject<LayerType | null>
}

export function useCanvasInteraction({
  layerRef,
}: UseCanvasInteractionParams): UseCanvasInteractionReturn {
  const camera = useCanvasStore((state) => state.camera)
  const setCamera = useCanvasStore((state) => state.setCamera)

  const [isPanning, setIsPanning] = useState(false)
  const dragStart = useRef<Vector2d>({ x: 0, y: 0 })
  const cameraStart = useRef<Vector2d>({ x: 0, y: 0 })

  const throttledSetCamera = useMemo(
    () => throttle(setCamera, CAMERA_THROTTLE_MS, CAMERA_THROTTLE_OPTIONS),
    [setCamera],
  )

  useEffect(() => {
    return () => throttledSetCamera.cancel()
  }, [throttledSetCamera])

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const pointerPos = getPointerPosition(e)
      if (!pointerPos) return

      const isMiddleButton = e.evt.button === 1
      if (!isMiddleButton) return

      setIsPanning(true)
      dragStart.current = pointerPos
      cameraStart.current = { ...camera }
    },
    [camera],
  )

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isPanning) return

      const pointerPos = getPointerPosition(e)
      if (!pointerPos) return

      const dx = pointerPos.x - dragStart.current.x
      const dy = pointerPos.y - dragStart.current.y

      layerRef.current?.setPosition({
        x: cameraStart.current.x + dx,
        y: cameraStart.current.y + dy,
      })
      layerRef.current?.batchDraw()
    },
    [isPanning, layerRef],
  )

  const handleMouseUp = useCallback(() => {
    if (!isPanning) return

    setIsPanning(false)
    throttledSetCamera.flush()
    setCamera({
      ...camera,
      ...layerRef.current?.getPosition(),
    })
  }, [camera, isPanning, layerRef, setCamera, throttledSetCamera])

  const wheelHandle = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
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

      throttledSetCamera(zoomCameraTo(camera, pointerPos, clampedScale))
    },
    [camera, throttledSetCamera],
  )

  const handleMouseLeave = handleMouseUp

  const handlers = useMemo(() => {
    return {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onWheel: wheelHandle,
    }
  }, [handleMouseDown, handleMouseLeave, handleMouseMove, handleMouseUp, wheelHandle])

  return {
    camera,
    cursor: isPanning ? 'cursor-grabbing' : 'cursor-default',
    handlers,
  }
}
