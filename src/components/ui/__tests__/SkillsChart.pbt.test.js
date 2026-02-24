/**
 * Feature: portfolio-vue-modernization, Property 5: D3 renderiza un elemento visual por skill
 * Validates: Requirements 5.1
 *
 * Verifies that for any array of N skills (N >= 1), the SkillsChart component
 * renders an SVG containing exactly N `.skill-bar-group` elements.
 */
import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import fc from 'fast-check'
import SkillsChart from '../SkillsChart.vue'

// Mock useTheme composable
vi.mock('@/composables/useTheme', () => ({
  useTheme: () => ({
    isDark: ref(false),
    toggleTheme: vi.fn(),
    init: vi.fn()
  })
}))

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver

// Generator for a single skill object
const skillArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 40 }),
  level: fc.integer({ min: 0, max: 100 }),
  icon: fc.string({ minLength: 1, maxLength: 40 })
})

// Generator for a non-empty array of skills
const skillsArrayArb = fc.array(skillArb, { minLength: 1, maxLength: 20 })

describe('Feature: portfolio-vue-modernization, Property 5: D3 renderiza un elemento visual por skill', () => {
  test('for N skills, the SVG contains exactly N .skill-bar-group elements', () => {
    fc.assert(
      fc.property(skillsArrayArb, (skills) => {
        const wrapper = mount(SkillsChart, {
          props: { skills },
          attachTo: document.body
        })

        const svg = wrapper.find('svg')
        expect(svg.exists()).toBe(true)

        const groups = svg.findAll('.skill-bar-group')
        expect(groups.length).toBe(skills.length)

        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })
})
