/**
 * Feature: portfolio-vue-modernization, Property 6: Íconos devicon presentes para items con tecnologías
 * Validates: Requirements 5.2, 8.3
 *
 * Verifies that for any skill object with a devicon icon class string,
 * the rendered SkillCategoryCard contains an <i> element with that exact CSS class.
 */
import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import SkillCategoryCard from '../SkillCategoryCard.vue'

// Generator for realistic devicon class names
const deviconClassArb = fc.tuple(
  fc.constantFrom(
    'python', 'javascript', 'typescript', 'java', 'csharp', 'go',
    'rust', 'ruby', 'php', 'swift', 'kotlin', 'react', 'vuejs',
    'angularjs', 'nodejs', 'docker', 'kubernetes', 'terraform',
    'amazonwebservices', 'googlecloud', 'azure', 'postgresql',
    'mongodb', 'redis', 'git', 'linux', 'nginx', 'django', 'flask'
  ),
  fc.constantFrom('plain', 'original', 'plain-wordmark', 'original-wordmark')
).map(([tech, variant]) => `devicon-${tech}-${variant}`)

// Generator for a valid skill object with a devicon icon
const skillWithDeviconArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  icon: deviconClassArb,
  details: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 8 }),
  level: fc.integer({ min: 0, max: 100 })
})

describe('Feature: portfolio-vue-modernization, Property 6: Íconos devicon presentes para items con tecnologías', () => {
  test('rendered component contains an <i> element with the exact devicon CSS class', () => {
    fc.assert(
      fc.property(skillWithDeviconArb, (skill) => {
        const wrapper = mount(SkillCategoryCard, {
          props: { skill }
        })

        // Find the <i> element
        const iconEl = wrapper.find('i')
        expect(iconEl.exists()).toBe(true)

        // The <i> element must have the exact devicon class
        expect(iconEl.classes()).toContain(skill.icon)

        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })

  test('devicon class is present in the rendered HTML', () => {
    fc.assert(
      fc.property(skillWithDeviconArb, (skill) => {
        const wrapper = mount(SkillCategoryCard, {
          props: { skill }
        })

        // The icon class string must appear in the rendered HTML
        expect(wrapper.html()).toContain(skill.icon)

        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })
})
