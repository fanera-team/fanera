import { create } from 'zustand'
import type { Element } from './elementTypes'

interface ElementsState {
  elements: Element[]
  addElement: (element: Element) => void
}

export const useElementsStore = create<ElementsState>((set) => ({
  elements: [],

  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
}))
