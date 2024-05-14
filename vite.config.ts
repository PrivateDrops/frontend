import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function getSentryToken() {
  const env = loadEnv('', process.cwd(), '')
  return env.VITE_SENTRY_AUTH_TOKEN
}

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ["VITE_"],
  plugins: [
    react(), 
    sentryVitePlugin({
      org: "privatedrops",
      project: "frontend",
      telemetry: false,
      authToken: getSentryToken(),
    })
  ],

  server: {
    watch: {
      usePolling: true,
    },
  },

  build: {
    sourcemap: true
  }
})
