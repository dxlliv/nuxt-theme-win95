declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.ttf?url' {
  const src: string
  export default src
}

declare module '*.woff?url' {
  const src: string
  export default src
}

declare module '*.woff2?url' {
  const src: string
  export default src
}

declare module '*MS Sans Serif*.ttf?url' {
  const src: string
  export default src
}
