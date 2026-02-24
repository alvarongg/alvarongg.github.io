/**
 * Feature: portfolio-vue-modernization, Property 10: Menú hamburguesa se cierra al navegar
 * Validates: Requirement 11.5
 *
 * For any state where isMenuOpen is true, calling scrollToSection with any
 * valid nav item ID must set isMenuOpen to false.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import fc from 'fast-check'

// Mock useScrollSpy composable
vi.mock('@/composables/useScrollSpy', () => ({
  useScrollSpy: () => ({ activeSection: ref('hero') })
}))

// Mock useTheme composable
vi.mock('@/composables/useTheme', () => ({
  useTheme: () => ({
    isDark: ref(false),
    toggleTheme: vi.fn(),
    init: vi.fn()
  })
}))

// Mock IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = class {
    constructor() {
      this.observe = vi.fn()
      this.disconnect = vi.fn()
      this.unobserve = vi.fn()
    }
  }
})

import AppNavbar from '../AppNavbar.vue'

const navItemIds = ['about', 'skills', 'experience', 'education', 'projects', 'hobbies', 'contact']

// Generator: pick any nav item ID
const navItemIdArb = fc.constantFrom(...navItemIds)

describe('Feature: portfolio-vue-modernization, Property 10: Menú hamburguesa se cierra al navegar', () => {
  test('scrollToSection closes the hamburger menu for any nav item ID', () => {
    fc.assert(
      fc.property(navItemIdArb, (sectionId) => {
        const wrapper = mount(AppNavbar)

        // Set menu to open
        wrapper.vm.isMenuOpen = true
        expect(wrapper.vm.isMenuOpen).toBe(true)

        // Navigate to section
        wrapper.vm.scrollToSection(sectionId)

        // Menu must be closed after navigation
        expect(wrapper.vm.isMenuOpen).toBe(false)

        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })
})
