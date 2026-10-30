import { defineDesktopConfig } from '@owdproject/nuxt'

export default defineDesktopConfig({
  modules: ['@owdproject/nuxt-module-pinia-persistence'],
  apps: [
    '@owdproject/nuxt-app-terminal',
  ],
  systemBar: { enabled: true, startButton: true },
  terminal: {
    welcomeMessage: 'Microsoft Windows 95',
    prompt: 'C:\\>',
  },
})
