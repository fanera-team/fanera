import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './spinner'

const meta = {
  title: 'Shared/UI/Spinner',
  component: Spinner,
  args: { size: 24 },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const AllSizes: Story = {
  render: () => (
    <div className="gap-6 flex items-center">
      {([16, 24, 32, 40, 48] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
}
