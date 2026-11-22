import type { Meta, StoryObj } from '@storybook/react-vite'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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

const createEmailSchema = (message: string) =>
  z.object({
    email: z.email({ message }),
  })

type EmailFormValues = z.infer<ReturnType<typeof createEmailSchema>>

type EmailFormProps = {
  defaultEmail?: string
  disabled?: boolean
  withDescription?: boolean
  validateOnMount?: boolean
}

function EmailForm({
  defaultEmail = '',
  disabled = false,
  withDescription = false,
  validateOnMount = false,
}: EmailFormProps) {
  const { t } = useTranslation('ui')
  const { t: tValidation } = useTranslation('validation')
  const schema = useMemo(() => createEmailSchema(tValidation('invalidEmail')), [tValidation])
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail },
    mode: 'onChange',
  })
  const { trigger } = form

  useEffect(() => {
    if (validateOnMount) void trigger()
  }, [trigger, validateOnMount])

  return (
    <Form {...form}>
      <form
        noValidate
        className="gap-4 flex w-full flex-col"
        onSubmit={form.handleSubmit(() => undefined)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('stories.field.emailLabel')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  disabled={disabled}
                  placeholder={withDescription ? undefined : t('stories.field.emailPlaceholder')}
                />
              </FormControl>
              {withDescription ? (
                <FormDescription>{t('stories.field.emailPlaceholder')}</FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled}>
          {t('stories.button.signIn')}
        </Button>
      </form>
    </Form>
  )
}

const meta = {
  title: 'Shared/UI/Form',
  component: EmailForm,
  decorators: [
    (Story) => (
      <div className="max-w-100 w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    defaultEmail: '',
    disabled: false,
    withDescription: false,
    validateOnMount: false,
  },
  argTypes: {
    defaultEmail: { control: 'text' },
    disabled: { control: 'boolean' },
    withDescription: { control: 'boolean' },
    validateOnMount: { control: 'boolean' },
  },
} satisfies Meta<typeof EmailForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <EmailForm key={args.defaultEmail} {...args} />,
}

export const Filled: Story = {
  args: { defaultEmail: 'name@example.com' },
  render: (args) => <EmailForm key={args.defaultEmail} {...args} />,
}

export const Invalid: Story = {
  args: { defaultEmail: 'name@example', validateOnMount: true },
  render: (args) => <EmailForm key={args.defaultEmail} {...args} />,
}

export const WithDescription: Story = {
  args: { withDescription: true },
  render: (args) => <EmailForm key={args.defaultEmail} {...args} />,
}

export const Disabled: Story = {
  args: { defaultEmail: 'name@example.com', disabled: true },
  render: (args) => <EmailForm key={args.defaultEmail} {...args} />,
}
