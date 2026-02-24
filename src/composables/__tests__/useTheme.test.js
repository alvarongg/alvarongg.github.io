import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '../useTheme.js'
import { nextTick } from 'vue'

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    // Reset singleton state to a known baseline
    const { isDark } = useTheme()
    isDark.value = false
    // Clear localStorage AFTER resetting isDark so watchEffect writes 'light'
    // then we clear it for a clean slate
    localStorage.clear()
  })

  it('returns isDark, toggleTheme, and init', () => {
    const { isDark, toggleTheme, init } = useTheme()
    expect(isDark).toBeDefined()
    expect(typeof toggleTheme).toBe('function')
    expect(typeof init).toBe('function')
  })

  it('init reads dark theme from localStorage', async () => {
    const { isDark, init } = useTheme()
    // Set localStorage after useTheme's watchEffect initial run
    localStorage.setItem('theme', 'dark')
    init()
    await nextTick()
    expect(isDark.value).toBe(true)
  })

  it('init reads light theme from localStorage', async () => {
    const { isDark, init } = useTheme()
    localStorage.setItem('theme', 'light')
    init()
    await nextTick()
    expect(isDark.value).toBe(false)
  })

  it('init falls back to prefers-color-scheme when no localStorage', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const { isDark, init } = useTheme()
    localStorage.clear()
    init()
    await nextTick()
    expect(isDark.value).toBe(true)
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  })

  it('toggleTheme inverts isDark', async () => {
    const { isDark, toggleTheme } = useTheme()
    isDark.value = false
    await nextTick()
    expect(isDark.value).toBe(false)

    toggleTheme()
    expect(isDark.value).toBe(true)

    toggleTheme()
    expect(isDark.value).toBe(false)
  })

  it('watchEffect syncs dark class on html element', async () => {
    const { isDark } = useTheme()
    isDark.value = true
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    isDark.value = false
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('watchEffect persists theme to localStorage', async () => {
    const { isDark } = useTheme()
    isDark.value = true
    await nextTick()
    expect(localStorage.getItem('theme')).toBe('dark')

    isDark.value = false
    await nextTick()
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('handles localStorage errors gracefully in init', () => {
    const originalGetItem = localStorage.getItem
    localStorage.getItem = () => { throw new Error('Access denied') }
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })

    const { init } = useTheme()
    expect(() => init()).not.toThrow()

    localStorage.getItem = originalGetItem
  })

  it('handles localStorage errors gracefully in watchEffect', async () => {
    const originalSetItem = localStorage.setItem
    localStorage.setItem = () => { throw new Error('Access denied') }

    const { isDark } = useTheme()
    isDark.value = true
    await nextTick()
    // Should not throw, dark class should still be toggled
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    localStorage.setItem = originalSetItem
  })

  it('shares isDark state across multiple useTheme calls (singleton)', () => {
    const theme1 = useTheme()
    const theme2 = useTheme()

    theme1.isDark.value = true
    expect(theme2.isDark.value).toBe(true)

    theme2.toggleTheme()
    expect(theme1.isDark.value).toBe(false)
    expect(theme2.isDark.value).toBe(false)
  })
})
