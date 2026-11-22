import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { Button } from '../button/button'
import { Input } from '../input/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

const EMAIL_LABEL = 'Email'
const EMAIL_DESCRIPTION = 'Используем для входа в аккаунт'
const INVALID_EMAIL = 'Укажите корректный адрес электронной почты'
const SUBMIT = 'Войти'
const EXTERNAL_HINT = 'Подсказка из родительского компонента'
const EXTERNAL_HINT_ID = 'email-external-hint'

const schema = z.object({
  email: z.email({ message: INVALID_EMAIL }),
})

type EmailFormValues = z.infer<typeof schema>

function EmailForm({ onValid = () => undefined }: { onValid?: (values: EmailFormValues) => void }) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  return (
    <>
      {/* Предоставляет данные всей формы */}
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onValid)}>
          {/* Запоминает имя текущего поля (email) */}
          <FormField
            //   все эти пропсы передаются в Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              // Создаёт уникальный ID для группы элементов
              <FormItem>
                {/* Показывает название поля */}
                <FormLabel>{EMAIL_LABEL}</FormLabel>
                {/* Добавляет ID и ARIA-атрибуты в ребёнка (Input) */}
                <FormControl>
                  <Input {...field} aria-describedby={EXTERNAL_HINT_ID} />
                </FormControl>
                {/* Показывает подсказку */}
                <FormDescription>{EMAIL_DESCRIPTION}</FormDescription>
                {/* Показывает ошибку */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{SUBMIT}</Button>
        </form>
      </Form>
      {/* Внешняя подсказка: её id приходит в Input снаружи, FormControl должен его сохранить */}
      <p id={EXTERNAL_HINT_ID}>{EXTERNAL_HINT}</p>
    </>
  )
}

describe('Form', () => {
  it('связывает подпись, внешнюю подсказку и описание с полем', () => {
    render(<EmailForm />)

    const input = screen.getByLabelText(EMAIL_LABEL)

    expect(input).toHaveAccessibleDescription(`${EXTERNAL_HINT} ${EMAIL_DESCRIPTION}`)
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByText(INVALID_EMAIL)).not.toBeInTheDocument()
  })

  it('сохраняет внешнюю подсказку в описании до и после появления ошибки', async () => {
    const user = userEvent.setup()
    render(<EmailForm />)

    const input = screen.getByLabelText(EMAIL_LABEL)

    expect(input).toHaveAccessibleDescription(`${EXTERNAL_HINT} ${EMAIL_DESCRIPTION}`)

    await user.click(screen.getByRole('button', { name: SUBMIT }))
    await screen.findByText(INVALID_EMAIL)

    expect(input).toHaveAccessibleDescription(
      `${EXTERNAL_HINT} ${EMAIL_DESCRIPTION} ${INVALID_EMAIL}`,
    )
  })

  it('показывает текст ошибки из Zod-схемы и помечает поле', async () => {
    const user = userEvent.setup()
    render(<EmailForm />)

    await user.click(screen.getByRole('button', { name: SUBMIT }))

    expect(await screen.findByText(INVALID_EMAIL)).toBeVisible()

    const input = screen.getByLabelText(EMAIL_LABEL)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(
      `${EXTERNAL_HINT} ${EMAIL_DESCRIPTION} ${INVALID_EMAIL}`,
    )
  })

  it('убирает ошибку после исправления поля', async () => {
    const user = userEvent.setup()
    render(<EmailForm />)

    await user.click(screen.getByRole('button', { name: SUBMIT }))
    await screen.findByText(INVALID_EMAIL)

    await user.type(screen.getByLabelText(EMAIL_LABEL), 'name@example.com')

    await waitFor(() => expect(screen.queryByText(INVALID_EMAIL)).not.toBeInTheDocument())

    const input = screen.getByLabelText(EMAIL_LABEL)
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).toHaveAccessibleDescription(`${EXTERNAL_HINT} ${EMAIL_DESCRIPTION}`)
  })

  it('передаёт валидные значения в обработчик отправки', async () => {
    const user = userEvent.setup()
    const onValid = vi.fn()
    render(<EmailForm onValid={onValid} />)

    await user.type(screen.getByLabelText(EMAIL_LABEL), 'name@example.com')
    await user.click(screen.getByRole('button', { name: SUBMIT }))

    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1))
    expect(onValid.mock.calls[0]?.[0]).toEqual({ email: 'name@example.com' })
  })

  it('не отправляет форму, пока схема не прошла проверку', async () => {
    const user = userEvent.setup()
    const onValid = vi.fn()
    render(<EmailForm onValid={onValid} />)

    await user.click(screen.getByRole('button', { name: SUBMIT }))
    await screen.findByText(INVALID_EMAIL)

    expect(onValid).not.toHaveBeenCalled()
  })
})
