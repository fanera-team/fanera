import { z } from 'zod'
import { uuidSchema } from './identifiers.js'

// Схемы элементов «loose»: незнакомое поле — не ошибка и не повод удалять или чинить элемент,
// документ его сохраняет (например, `locked` от нового клиента). Плата: опечатки в
// необязательных полях валидация не ловит. На уровне типов модель закрыта — см. ClosedModel.

// ========================= Enums =========================

export const ElementEnum = {
  STICKY: 'sticky',
  TEXT: 'text',
  SHAPE: 'shape',
  IMAGE: 'image',
  CONNECTOR: 'connector',
  GROUP: 'group',
  FRAME: 'frame',
} as const

export const AnchorEnum = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
} as const

export const ShapeEnum = {
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  DIAMOND: 'diamond',
  TRIANGLE: 'triangle',
} as const

// ========================= Общие примитивы =========================

// Цвет — hex, как в макетах: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
const colorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)

const positiveSizeSchema = z.number().positive()
const nonNegativeSizeSchema = z.number().min(0)

const opacitySchema = z.number().min(0).max(1)

// ========================= Ограничения модели элемента =========================

// deep-dive §17: координаты — конечные числа в пределах ±10⁷
const MAX_COORDINATE = 10_000_000
const coordinateSchema = z.number().min(-MAX_COORDINATE).max(MAX_COORDINATE)

// deep-dive §17: w и h больше 0 и не больше 10⁵ у всех типов, кроме connector и group,
// у них размеры не используются и равны 0
const MAX_ELEMENT_SIZE = 100_000
const sizeSchema = z.number().positive().max(MAX_ELEMENT_SIZE)

// database §2: у connector и group свои координаты и размеры не используются — равны 0
const zeroSchema = z.literal(0)

// database §2: rotation — градусы. Холст нормализует угол в [0, 360): -15° хранится как 345°,
// 360° — как 0. Схема принимает только нормализованное значение, иначе один и тот же поворот
// лежал бы в документе по-разному и сравнение элементов врало бы.
const MAX_ROTATION = 360
const rotationSchema = z.number().gte(0).lt(MAX_ROTATION)

// deep-dive §17: текст до 10 000 символов. В Y.Doc это Y.Text, схема проверяет
// материализованную строку: сервер сравнивает длину через text.toString()
const MAX_TEXT_LENGTH = 10_000
const textContentSchema = z.string().max(MAX_TEXT_LENGTH)

// ========================= Общие схемы стилей =========================

const fillStyleSchema = z.looseObject({
  fill: colorSchema.optional(),
})

const strokeStyleSchema = z.looseObject({
  stroke: colorSchema.optional(),
  strokeWidth: nonNegativeSizeSchema.optional(),
})

const typographySchema = z.looseObject({
  fontSize: positiveSizeSchema.optional(),
  fontFamily: z.string().min(1).optional(),
  fontWeight: z.number().int().min(100).max(900).optional(),
  color: colorSchema.optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
})

// ========================= Схемы стилей для конкретных элементов =========================

export const stickyStyleSchema = fillStyleSchema
  .extend(strokeStyleSchema.shape)
  .extend(typographySchema.shape)

export const textStyleSchema = typographySchema

export const shapeStyleSchema = fillStyleSchema.extend(strokeStyleSchema.shape).extend({
  borderRadius: nonNegativeSizeSchema.optional(),
})

export const imageStyleSchema = z.looseObject({
  opacity: opacitySchema.optional(),
  objectFit: z.enum(['contain', 'cover', 'fill', 'none']).optional(),
})

export const connectorStyleSchema = strokeStyleSchema.extend({
  lineStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  startArrow: z.enum(['none', 'arrow', 'circle']).optional(),
  endArrow: z.enum(['none', 'arrow', 'circle']).optional(),
})

export const groupStyleSchema = z.looseObject({
  opacity: opacitySchema.optional(),
})

export const frameStyleSchema = fillStyleSchema.extend(strokeStyleSchema.shape).extend({
  titleColor: colorSchema.optional(),
})

// ========================= Общие схемы элементов =========================

// baseSchema — только источник shape для loose-схем элементов (спред ниже), поэтому его
// собственный режим неизвестных ключей ни на что не влияет. Оставляем z.object, чтобы не
// создавать впечатление, что его разбирают отдельно.
const baseSchema = z.object({
  id: uuidSchema,
  x: coordinateSchema,
  y: coordinateSchema,
  z: z.string().min(1),
  // rotation обязателен: клиент пишет 0, если элемент не поворачивали. Отсутствие поля или
  // значение вне [0, 360) — повод для server-repair (0), а не для default в схеме: default
  // подставил бы 0 только в результат parse, а в самом Y.Doc поля так и не появилось бы.
  rotation: rotationSchema,
  parentId: uuidSchema.optional(),
  createdBy: uuidSchema,
  // database §2: updatedAt — epoch-мс числом, как в документе доски.
  // ISO-строка — контракт REST, внутри Y.Doc время хранится числом.
  updatedAt: z.number().int().nonnegative(),
})

const connectorEndpointSchema = z.looseObject({
  elementId: uuidSchema,
  anchor: z.enum(AnchorEnum),
})

// ========================= Схемы элементов =========================

export const stickySchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.STICKY),
    w: sizeSchema,
    h: sizeSchema,
    text: textContentSchema.optional(),
    style: stickyStyleSchema,
  })
  .meta({ id: 'StickyElement' })

export const textSchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.TEXT),
    w: sizeSchema,
    h: sizeSchema,
    text: textContentSchema.optional(),
    style: textStyleSchema,
  })
  .meta({ id: 'TextElement' })

export const shapeSchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.SHAPE),
    shape: z.enum(ShapeEnum),
    w: sizeSchema,
    h: sizeSchema,
    text: textContentSchema.optional(),
    style: shapeStyleSchema,
  })
  .meta({ id: 'ShapeElement' })

export const imageSchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.IMAGE),
    w: sizeSchema,
    h: sizeSchema,
    fileId: uuidSchema,
    style: imageStyleSchema,
  })
  .meta({ id: 'ImageElement' })

export const connectorSchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.CONNECTOR),
    // §2: у коннектора своей геометрии нет — линию считает клиент, поля равны 0
    x: zeroSchema,
    y: zeroSchema,
    w: zeroSchema,
    h: zeroSchema,
    rotation: zeroSchema,
    from: connectorEndpointSchema,
    to: connectorEndpointSchema,
    style: connectorStyleSchema,
  })
  .meta({ id: 'ConnectorElement' })

export const groupSchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.GROUP),
    // §2: у группы своей геометрии нет — рамку клиент считает по детям, поля равны 0
    x: zeroSchema,
    y: zeroSchema,
    w: zeroSchema,
    h: zeroSchema,
    rotation: zeroSchema,
    style: groupStyleSchema,
  })
  .meta({ id: 'GroupElement' })

export const frameSchema = z
  .looseObject({
    ...baseSchema.shape,
    type: z.literal(ElementEnum.FRAME),
    w: sizeSchema,
    h: sizeSchema,
    text: textContentSchema.optional(),
    style: frameStyleSchema,
  })
  .meta({ id: 'FrameElement' })

// ========================= Элемент =========================

// parse возвращает ParsedElement (см. «Типы» ниже): в нём остаются незнакомые поля.
// В приложении работаем с Element — он описывает только известные поля.
export const elementSchema = z
  .discriminatedUnion('type', [
    stickySchema,
    textSchema,
    shapeSchema,
    imageSchema,
    connectorSchema,
    groupSchema,
    frameSchema,
  ])
  .meta({ id: 'Element' })

// ========================= Типы =========================

// Схемы loose, поэтому z.infer содержит `[k: string]: unknown`. Убираем широкий строковый
// ключ (и производный от него number), чтобы в коде не было незнакомых полей и снова
// ловились опечатки. В рантайме parse по-прежнему возвращает незнакомые поля с собой.
// `T extends unknown` распределяет union по вариантам, иначе keyof оставит только общие ключи.
type ClosedModel<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? {
        [K in keyof T as K extends string ? (string extends K ? never : K) : never]: ClosedModel<
          T[K]
        >
      }
    : T

// Закрытые варианты модели: ими пользуются UI, стор и создание элементов. Незнакомые
// поля сюда не попадают — за них отвечает ParsedElement ниже.
export type StickyElement = ClosedModel<z.infer<typeof stickySchema>>
export type TextElement = ClosedModel<z.infer<typeof textSchema>>
export type ShapeElement = ClosedModel<z.infer<typeof shapeSchema>>
export type ImageElement = ClosedModel<z.infer<typeof imageSchema>>
export type ConnectorElement = ClosedModel<z.infer<typeof connectorSchema>>
export type GroupElement = ClosedModel<z.infer<typeof groupSchema>>
export type FrameElement = ClosedModel<z.infer<typeof frameSchema>>

/**
 * Модель элемента: только известные поля, незнакомых нет.
 *
 * Где живёт: везде, где код работает с элементом по смыслу — рендер на холсте,
 * выделение и геометрия, стор, пропсы компонентов, создание нового элемента.
 * Откуда берётся: собирается в коде (только из полей, описанных в схеме) или
 * получается из ParsedElement простым присваиванием — parse уже проверил данные.
 * Типом результата `parse` не является: для этого есть ParsedElement.
 */
export type Element =
  | StickyElement
  | TextElement
  | ShapeElement
  | ImageElement
  | ConnectorElement
  | GroupElement
  | FrameElement

/**
 * Результат разбора данных извне: известные поля плюс незнакомые как `unknown`.
 *
 * Где живёт: только на границе доверия — там, где элемент пришёл не из кода:
 * - сервер: `elementSchema.parse(element.toJSON())` после применения правки; дальше
 *   починка и ответ автору, но не рендер;
 * - клиент: загрузка документа из IndexedDB или снапшота и входящий update от других
 *   участников — перед тем как отдать элемент в рендер.
 *
 * Зачем: незнакомые поля (например, `locked` от более нового клиента) сохраняются при
 * разборе и не считаются ошибкой. Вглубь приложения этот тип не передаём — там Element;
 * перебор незнакомых полей (метрики, отладка) — единственное место, где он уместен.
 */
export type ParsedElement = z.infer<typeof elementSchema>
