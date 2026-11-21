import { healthSchema } from '@fanera/contracts'

export async function getHealth() {
  const response = await fetch('/health')
  const body: unknown = await response.json()
  return healthSchema.parse(body)
}
