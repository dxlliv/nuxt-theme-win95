import { defineNuxtPlugin } from 'nuxt/app'
import { defineDesktopApp } from '@owdproject/nuxt/kit/defineDesktopApp'
import configAppCalculator from './app.config'

export default defineNuxtPlugin({
  name: 'desktop-theme-win95-calculator',
  dependsOn: ['pinia', 'desktop-shell-init'],
  async setup() {
    if (import.meta.server) return
    await defineDesktopApp(configAppCalculator)
  },
})
