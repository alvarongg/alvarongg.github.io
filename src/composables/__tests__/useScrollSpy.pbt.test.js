/**
 * Feature: portfolio-vue-modernization, Property 9: Scroll spy identifica sección activa correctamente
 * Validates: Requirement 11.2
 *
 * For any set of section IDs and an intersection event on one of them,
 * useScrollSpy must report activeSection equal to that section's ID.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { nextTick, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { useScrollSpy } from '../useScrollSpy.js'

// Helper: mount a composable inside a real component so lifecycle hooks fire
function withSetup(composableFn) {
  let result
  const Comp = defineComponent({
    setup() {
      result = composableFn()
      return () => null
    }
  })
  const wrapper = mount(Comp)
  return { result, wrapper }
}

// Generator: unique non-empty array of valid HTML id strings
const sectionIdsArb = fc
  .uniqueArray(
    fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/),
    { minLength: 1, maxLength: 20 }
  )

describe('Feature: portfolio-vue-modernization, Property 9: Scroll spy identifica sección activa correctamente', () => {
  let observerCallback

  beforeEach(() => {
    observerCallback = null

    global.IntersectionObserver = class {
      constructor(callback) {
        observerCallback = callback
        this.observe = vi.fn()
        this.disconnect = vi.fn()
        this.unobserve = vi.fn()
      }
    }
  })

  test('activeSection equals the ID of the intersecting section for any section array and index', async () => {
    await fc.assert(
      fc.asyncProperty(
        sectionIdsArb,
        fc.integer({ min: 0, max: 999 }),
        async (sectionIds, rawIndex) => {
          // Pick a valid index into the array
          const index = rawIndex % sectionIds.length

          // Create DOM elements
          sectionIds.forEach((id) => {
            const el = document.createElement('div')
            el.id = id
            document.body.appendChild(el)
          })

          try {
            const { result, wrapper } = withSetup(() => useScrollSpy(sectionIds))

            // Simulate IntersectionObserver firing for the chosen section
            observerCallback([
              { isIntersecting: true, target: { id: sectionIds[index] } }
            ])
            await nextTick()

            expect(result.activeSection.value).toBe(sectionIds[index])

            wrapper.unmount()
          } finally {
            // Cleanup DOM
            sectionIds.forEach((id) => document.getElementById(id)?.remove())
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('after a sequence of intersection events, activeSection equals the last intersecting ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        sectionIdsArb,
        fc.array(fc.integer({ min: 0, max: 999 }), { minLength: 1, maxLength: 10 }),
        async (sectionIds, rawIndices) => {
          // Map raw indices to valid section indices
          const indices = rawIndices.map((i) => i % sectionIds.length)

          // Create DOM elements
          sectionIds.forEach((id) => {
            const el = document.createElement('div')
            el.id = id
            document.body.appendChild(el)
          })

          try {
            const { result, wrapper } = withSetup(() => useScrollSpy(sectionIds))

            // Fire a sequence of intersection events
            for (const idx of indices) {
              observerCallback([
                { isIntersecting: true, target: { id: sectionIds[idx] } }
              ])
            }
            await nextTick()

            const lastIdx = indices[indices.length - 1]
            expect(result.activeSection.value).toBe(sectionIds[lastIdx])

            wrapper.unmount()
          } finally {
            sectionIds.forEach((id) => document.getElementById(id)?.remove())
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
