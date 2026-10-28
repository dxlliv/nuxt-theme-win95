<template>
  <DesktopCoreWindowContent>
    <slot />
  </DesktopCoreWindowContent>
</template>

<style scoped lang="scss">
.desktop-window__content {
  display: block;
  flex: 1;
  position: relative;
  min-height: 0;

  &--centered {
    align-content: center;
    height: 100%;
  }

  &--padded {
    padding: var(--owd-card-body-padding, 8px);
  }
}
</style>
