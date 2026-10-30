# Win95 Theme

Windows 95 style shell for Open Web Desktop, using `@owdproject/nuxt` directly.

## Standalone playground

From a clone of this theme repository:

```sh
pnpm install
pnpm dev
```

The local workspace includes only the theme and its playground. Dependencies are installed as packages; no client checkout is required. During local snapshot testing, use the local registry: `pnpm install --registry http://localhost:4873/`.

```sh
pnpm dev:build
pnpm dev:generate
```

## Use in another Nuxt application

Install `@dxlliv/owd-theme-nuxt-win95` and `@owdproject/nuxt`, then configure:

```ts
export default defineNuxtConfig({
  ssr: false,
  modules: ['@owdproject/nuxt'],
  desktop: {
    theme: '@dxlliv/owd-theme-nuxt-win95',
    systemBar: { enabled: true, startButton: true, position: 'bottom' },
  },
})
```

The playground also installs the filesystem module, Pinia persistence, and the terminal app. Window chrome lives in `src/runtime/components/Window/`.

## License

MIT
