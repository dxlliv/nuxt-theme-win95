import { defineDesktopConfig } from 'nuxt-desktop'

export default defineDesktopConfig({
  theme: '@owdproject/theme-win95',
  modules: ['@owdproject/module-fs', '@owdproject/module-persistence'],
  apps: [
    '@owdproject/app-terminal',
  ],
  systemBar: { enabled: true, startButton: true },
  terminal: {
    welcomeMessage: 'Microsoft Windows 95',
    prompt: 'C:\\>',
  },
  fs: {
    mounts: {
      '/mnt/test': '/test-small.zip',
    },
  },
})
