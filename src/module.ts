import { existsSync } from 'node:fs'
import type { NuxtModule } from '@nuxt/schema'
import {
  createResolver,
  addComponentsDir,
  addImportsDir,
  installModule,
} from '@nuxt/kit'
import { defineDesktopTheme } from 'nuxt-desktop'
import {
  registerTailwindPath,
  registerThemeTailwindPath,
} from '@owdproject/kit-tailwind/kit/registerTailwindPath'
import { installWin95BuiltInApps } from './runtime/apps/installBuiltInApps'

const theme: NuxtModule<any> = defineDesktopTheme({
  meta: {
    name: 'desktop-theme-win95',
  },
  defaults: {
    name: 'win95',
    systemBar: {
      enabled: true,
      position: 'bottom',
      startButton: true,
    },
    windows: {
      position: 'fixed',
    },
    fs: {
      defaultUserHome: '/Users/Guest',
      mounts: {
        '/Users': 'WebStorage',
      },
    },
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await installModule('@owdproject/kit-primevue')

    registerThemeTailwindPath(nuxt, import.meta.url)
    registerTailwindPath(nuxt, resolve('./runtime/pages/**/*.{vue,mjs,ts}'))

    // Win95 chrome is SCSS-driven; Tailwind preflight resets break PrimeVue / theme partials.
    nuxt.hook('tailwindcss:config', (config) => {
      config.corePlugins = { ...(config.corePlugins ?? {}), preflight: false }
    })

    const cssEntry = existsSync(resolve('./runtime/assets/styles/index.css'))
      ? resolve('./runtime/assets/styles/index.css')
      : resolve('./runtime/assets/styles/index.scss')

    nuxt.options.css.push(cssEntry)

    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
    })

    nuxt.hook('i18n:registerModule', (register) => {
      const enFile = existsSync(resolve('./runtime/i18n/locales/en.js'))
        ? 'locales/en.js'
        : 'locales/en.ts'

      register({
        langDir: resolve('./runtime/i18n'),
        locales: [
          {
            code: 'en',
            file: enFile,
          },
        ],
      })
    })

    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/consts'))
    addImportsDir(resolve('./runtime/stores'))
    addImportsDir(resolve('./runtime/utils'))

    installWin95BuiltInApps(nuxt, import.meta.url)
  },
})

export default theme

