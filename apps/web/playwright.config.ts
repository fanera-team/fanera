import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
  },
  webServer: {
    command: 'pnpm dev --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
