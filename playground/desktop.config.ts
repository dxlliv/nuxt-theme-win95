import { defineDesktopConfig } from '@owdproject/nuxt'

export default defineDesktopConfig({
  modules: ['@owdproject/module-nuxt-pinia-persistence'],
  apps: [
    '@owdproject/app-nuxt-terminal',
  ],
  systemBar: { enabled: true, startButton: true },
  terminal: {
    welcomeMessage: 'Microsoft Windows 95',
    prompt: 'C:\\>',
  },
})
