export const DEFAULT_SHAPE_STYLE = {
  fill: 'yellow',
  stroke: 'red',
} as const

export const DEFAULT_RECTANGLE_SHAPE = {
  ...DEFAULT_SHAPE_STYLE,
  width: 50,
  height: 50,
} as const
