<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    class="p-2 rounded-lg text-xl transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    @click="toggleTheme"
  >
    <Transition name="theme-icon" mode="out-in">
      <i v-if="isDark" key="sun" class="fas fa-sun text-yellow-400" />
      <i v-else key="moon" class="fas fa-moon text-gray-600 dark:text-gray-300" />
    </Transition>
  </button>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
