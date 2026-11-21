import { healthSchema, type HealthDto } from '@fanera/contracts'

export async function getHealth(): Promise<HealthDto> {
  const response = await fetch('/health')
  const body: unknown = await response.json()
  return healthSchema.parse(body)
}
