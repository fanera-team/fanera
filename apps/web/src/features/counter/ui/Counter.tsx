import { Button } from '@/shared/components/ui'
import { useTranslation } from 'react-i18next'
import { useCounterStore } from '../model/counter-store'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const { t } = useTranslation('ui')

  return (
    <div className="gap-4 flex flex-col items-center">
      <div>{t('demo.count', { count })}</div>
      <div className="gap-2 flex justify-start">
        <CounterControl type="increment" />
        <CounterControl type="decrement" />
      </div>
    </div>
  )
}

function CounterControl({ type }: { type: 'increment' | 'decrement' }) {
  const action = useCounterStore((state) => state[type])
  const { t } = useTranslation('ui')

  return <Button onClick={action}>{t(`demo.${type}`)}</Button>
}
