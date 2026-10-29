import type { Nuxt } from '@nuxt/schema'
import { hasDesktopModule } from '@owdproject/nuxt'

/**
 * Built-in Win95 theme apps under `runtime/apps/<name>/`.
 * Explorer expects `@owdproject/module-nuxt-fs` in `desktop.config.ts` `modules`.
 */
export type Win95ThemeBuiltInApp = {
  name: string
  autoload: boolean
  when?: (nuxt: any) => boolean
}

export const WIN95_THEME_BUILTIN_APPS: Win95ThemeBuiltInApp[] = [
  { name: 'calculator', autoload: true },
  { name: 'explorer', autoload: true, when: (nuxt: any) => hasDesktopModule(nuxt, 'nuxt-fs') },
  { name: 'notepad', autoload: true },
]
