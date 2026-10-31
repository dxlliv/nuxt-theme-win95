import { defineDesktopConfig } from '@owdproject/nuxt'
import showcase from './presets/showcase.ts'

export default defineDesktopConfig({
  theme: '@owdproject/nuxt-theme-win95',
  ...showcase,
})
