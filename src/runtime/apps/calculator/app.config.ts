export default {
  id: 'org.owdproject.calculator',
  title: 'Calculator',
  category: 'accessories',
  singleton: true,
  icon: 'mdi:calculator-variant',
  provides: {
    name: 'calculator',
    entry: 'calculator',
  },
  windows: {
    main: {
      component: () => import('./components/Window/WindowCalculator.vue'),
      resizable: false,
      size: {
        width: 282,
        height: 'auto',
      },
      position: {
        x: 320,
        y: 180,
        z: 0,
      },
    },
  },
  entries: {
    calculator: {
      command: 'calculator',
    },
  },
  commands: {
    calculator: (app: any) => {
      return app.openWindow('main')
    },
  },
}
