import { cn } from 'cn'
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Label } from '../label/label'
import * as React from 'react'

const Form = FormProvider

type FormFieldContextValue = {
  name: FieldPath<FieldValues>
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

// собирает всю необходимую информацию о текущем поле
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  // Получаем информацию о состоянии формы из react-hook-form. getFieldState позволяет получить состояние конкретного поля. formState содержит общее состояние формы
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error('useFormField must be used inside <FormField>')
  }

  if (!itemContext) {
    throw new Error('useFormField must be used inside <FormItem>')
  }

  return {
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...getFieldState(fieldContext.name, formState),
  }
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const value = React.useMemo<FormFieldContextValue>(() => ({ name: props.name }), [props.name])

  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// задача FormItem — создать уникальный ID и передать его дочерним компонентам
function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div {...props} data-slot="form-item" className={cn('gap-2 grid', className)} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<'label'>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      {...props}
      data-slot="form-label"
      htmlFor={formItemId}
      className={cn(error && 'text-destructive', className)}
    />
  )
}

type FormControlChildProps = {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: React.AriaAttributes['aria-invalid']
}

// задача компонента — подготовить вложенный элемент к работе с формой
function FormControl({ children }: { children: React.ReactElement<FormControlChildProps> }) {
  const { error, formDescriptionId, formItemId, formMessageId } = useFormField()
  // сохраняем внешние ссылки на подсказки и добавляем к ним id описания и ошибки формы
  const describedBy = [
    children.props['aria-describedby'],
    formDescriptionId,
    error ? formMessageId : undefined,
  ]
    // отбрасываем undefined
    .filter(Boolean)
    .join(' ')

  return React.cloneElement(children, {
    id: formItemId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
  })
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      {...props}
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? error.message : children

  if (!body) return null

  return (
    <p
      {...props}
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
    >
      {body}
    </p>
  )
}

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage }
