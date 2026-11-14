import { Button } from '@/shared/components/ui/button'
import { useCounterStore } from '../model/counter-store'

export function Counter() {
  const count = useCounterStore((state) => state.count)

  return (
    <div className="gap-4 flex items-center justify-center">
      <div>Count: {count}</div>
      <div className="gap-2 flex">
        <CounterControl type="increment" />
        <CounterControl type="decrement" />
      </div>
    </div>
  )
}

function CounterControl({ type }: { type: 'increment' | 'decrement' }) {
  const action = useCounterStore((state) => state[type])

  return <Button onClick={action}>{type}</Button>
}
