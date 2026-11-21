import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './icon'
import { iconMap } from './icon-map'

const meta = {
  title: 'Shared/UI/Icon',
  component: Icon,
  args: { name: 'sticky-note' },
  argTypes: { name: { control: 'select', options: Object.keys(iconMap) } },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 's' } }
export const Medium: Story = { args: { size: 'm' } }
export const Large: Story = { args: { size: 'l' } }

export const Gallery: Story = {
  render: () => (
    <div className="gap-4 md:grid-cols-6 grid grid-cols-4">
      {(Object.keys(iconMap) as (keyof typeof iconMap)[]).map((name) => (
        <div key={name} className="min-w-24 gap-2 text-xs flex flex-col items-center text-center">
          <Icon name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
}
