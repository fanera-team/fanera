import { beforeEach, expect, test } from 'vitest'
import { useCounterStore } from './counter-store'

beforeEach(() => {
  useCounterStore.setState({ count: 0 })
})

test('increments and decrements the count', () => {
  useCounterStore.getState().increment()
  expect(useCounterStore.getState().count).toBe(1)

  useCounterStore.getState().decrement()
  expect(useCounterStore.getState().count).toBe(0)
})
