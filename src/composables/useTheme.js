import { ref, watchEffect } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function init() {
    try {
      const stored = localStorage.getItem('theme')
      if (stored) {
        isDark.value = stored === 'dark'
        return
      }
    } catch {
      // localStorage not available (e.g. incognito mode)
    }
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch {
      // localStorage not available (e.g. incognito mode)
    }
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme, init }
}
