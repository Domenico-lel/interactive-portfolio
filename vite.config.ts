import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Read PORT without pulling in @types/node (avoids referencing the `process`
// global directly, which tsc would flag). Lets the dev preview use an
// assigned port; ignored in production builds.
const envPort = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env?.PORT

export default defineConfig({
  plugins: [react()],
  server: {
    port: envPort ? Number(envPort) : undefined,
  },
})
