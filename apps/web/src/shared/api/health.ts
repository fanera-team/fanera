import { healthSchema, type HealthResponse } from '@fanera/contracts'

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch('/health')
  const data: unknown = await response.json()
  return healthSchema.parse(data)
}
