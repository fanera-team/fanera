'use client';

import { useCounterStore } from '@/stores/counter-store';
import { Button } from './ui/button';

export default function Counter() {
	const count = useCounterStore((s) => s.count);

	return (
		<div className="flex flex-col gap-4">
			<div>Count: {count}</div>
			<div className="flex gap-2">
				<CounterControl type="increment" />
				<CounterControl type="decrement" />
			</div>
		</div>
	);
}

function CounterControl({ type }: { type: 'increment' | 'decrement' }) {
	const action = useCounterStore((s) => s[type]);

	return <Button onClick={action}>{type}</Button>;
}
