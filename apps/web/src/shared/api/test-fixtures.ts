import { authResponseSchema, userPublicSchema } from '@fanera/contracts'

const mockUser = userPublicSchema.parse({
  id: '3f2c7b5e-4a1d-4f89-8d21-7c8f10a2b345',
  name: 'Test User',
  avatarUrl: null,
})

export const mockAuthResponse = authResponseSchema.parse({
  accessToken: 'test-access-token',
  expiresIn: 900,
  user: mockUser,
})
