import type { ThrottleOptions } from '@/shared/lib/throttle'

export const CAMERA_ZOOM_CONFIG = {
  min: 0.1,
  max: 5,
  scaleFactor: 1.1,
} as const

export const CAMERA_THROTTLE_MS = 25
export const CAMERA_THROTTLE_OPTIONS = {
  leading: false,
  trailing: true,
} as const satisfies ThrottleOptions
