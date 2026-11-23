import { create } from 'zustand'

export interface Camera {
  x: number
  y: number
  scale: number
}

interface CanvasState {
  // shapes: Shape[]
  camera: Camera

  setCamera: (camera: Camera) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  shapes: [],
  camera: { x: 0, y: 0, scale: 1 },
  selectedIds: [],

  setCamera: (camera) => set({ camera }),
}))
