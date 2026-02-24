/**
 * Feature: portfolio-vue-modernization, Property 11: Round-trip de tema (toggle y persistencia)
 * Validates: Requirements 12.1, 12.2, 12.3, 12.5
 *
 * Verifies that toggleTheme inverts isDark, syncs the 'dark' class on
 * document.documentElement, and persists the correct value in localStorage.
 */
import { describe, test, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import fc from 'fast-check'
import { useTheme } from '../useTheme.js'

describe('Feature: portfolio-vue-modernization, Property 11: Round-trip de tema (toggle y persistencia)', () => {
  beforeEach(async () => {
    // Reset singleton to known state
    const { isDark } = useTheme()
    isDark.value = false
    await nextTick()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  test('toggleTheme inverts isDark for any initial boolean state', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (initialDark) => {
        const { isDark, toggleTheme } = useTheme()

        // Set initial state
        isDark.value = initialDark
        await nextTick()

        // Toggle
        toggleTheme()
        await nextTick()

        // isDark must be the inverse of the initial value
        expect(isDark.value).toBe(!initialDark)
      }),
      { numRuns: 100 }
    )
  })

  test('after toggle, document.documentElement dark class matches isDark', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (initialDark) => {
        const { isDark, toggleTheme } = useTheme()

        isDark.value = initialDark
        await nextTick()

        toggleTheme()
        await nextTick()

        const hasDarkClass = document.documentElement.classList.contains('dark')
        expect(hasDarkClass).toBe(isDark.value)
      }),
      { numRuns: 100 }
    )
  })

  test('after toggle, localStorage theme matches isDark', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (initialDark) => {
        const { isDark, toggleTheme } = useTheme()

        isDark.value = initialDark
        await nextTick()

        toggleTheme()
        await nextTick()

        const stored = localStorage.getItem('theme')
        const expectedStored = isDark.value ? 'dark' : 'light'
        expect(stored).toBe(expectedStored)
      }),
      { numRuns: 100 }
    )
  })

  test('for any sequence of N toggles, final state is initialDark XOR (N % 2 === 1)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.integer({ min: 1, max: 50 }),
        async (initialDark, toggleCount) => {
          const { isDark, toggleTheme } = useTheme()

          isDark.value = initialDark
          await nextTick()

          for (let i = 0; i < toggleCount; i++) {
            toggleTheme()
          }
          await nextTick()

          // After N toggles: if N is odd, isDark is flipped; if even, same as initial
          const expectedDark = toggleCount % 2 === 1 ? !initialDark : initialDark
          expect(isDark.value).toBe(expectedDark)

          // DOM class must match
          expect(document.documentElement.classList.contains('dark')).toBe(expectedDark)

          // localStorage must match
          expect(localStorage.getItem('theme')).toBe(expectedDark ? 'dark' : 'light')
        }
      ),
      { numRuns: 100 }
    )
  })
})
