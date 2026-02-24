/**
 * Feature: portfolio-vue-modernization, Property 7: Experiencias ordenadas cronológicamente
 * Validates: Requirement 6.4
 *
 * For any array of experience objects with startDate strings (format "YYYY-MM")
 * and optional numeric `order` field:
 * - Items with `order` come before items without
 * - Items with `order` are sorted ascending by `order`
 * - Items without `order` are sorted descending by `startDate`
 * - The original array is not mutated
 */
import { describe, test, expect } from 'vitest'
import fc from 'fast-check'
import { sortExperiences } from '../experienceUtils.js'

describe('Feature: portfolio-vue-modernization, Property 7: Experiencias ordenadas cronológicamente', () => {
  // Generator: YYYY-MM formatted date strings
  const yearArb = fc.integer({ min: 1990, max: 2099 })
  const monthArb = fc.integer({ min: 1, max: 12 })
  const startDateArb = fc.tuple(yearArb, monthArb).map(
    ([y, m]) => `${y}-${String(m).padStart(2, '0')}`
  )

  // Generator: experience object without order field
  const experienceWithoutOrderArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    company: fc.string({ minLength: 1, maxLength: 50 }),
    period: fc.string({ minLength: 1, maxLength: 30 }),
    startDate: startDateArb,
    description: fc.string({ maxLength: 100 }),
  })

  // Generator: experience object with numeric order field
  const experienceWithOrderArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    company: fc.string({ minLength: 1, maxLength: 50 }),
    period: fc.string({ minLength: 1, maxLength: 30 }),
    startDate: startDateArb,
    description: fc.string({ maxLength: 100 }),
    order: fc.integer({ min: 0, max: 100 }),
  })

  // Generator: mixed array of experiences (some with order, some without)
  const mixedExperiencesArb = fc.tuple(
    fc.array(experienceWithOrderArb, { minLength: 1, maxLength: 15 }),
    fc.array(experienceWithoutOrderArb, { minLength: 1, maxLength: 15 })
  ).chain(([withOrder, withoutOrder]) =>
    fc.shuffledSubarray([...withOrder, ...withoutOrder], {
      minLength: withOrder.length + withoutOrder.length,
      maxLength: withOrder.length + withoutOrder.length,
    })
  )

  test('items with order field come before items without order', () => {
    fc.assert(
      fc.property(
        mixedExperiencesArb,
        (experiences) => {
          const sorted = sortExperiences(experiences)

          // Find the last index of an item with order and the first index without
          let lastOrderedIndex = -1
          let firstUnorderedIndex = sorted.length

          sorted.forEach((item, i) => {
            if (typeof item.order === 'number') {
              lastOrderedIndex = i
            } else if (firstUnorderedIndex === sorted.length) {
              firstUnorderedIndex = i
            }
          })

          if (lastOrderedIndex >= 0 && firstUnorderedIndex < sorted.length) {
            expect(lastOrderedIndex).toBeLessThan(firstUnorderedIndex)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('items with order are sorted by order ascending', () => {
    fc.assert(
      fc.property(
        fc.array(experienceWithOrderArb, { minLength: 2, maxLength: 30 }),
        (experiences) => {
          const sorted = sortExperiences(experiences)
          const ordered = sorted.filter((e) => typeof e.order === 'number')

          for (let i = 0; i < ordered.length - 1; i++) {
            expect(ordered[i].order).toBeLessThanOrEqual(ordered[i + 1].order)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('items without order are sorted by startDate descending', () => {
    fc.assert(
      fc.property(
        fc.array(experienceWithoutOrderArb, { minLength: 2, maxLength: 30 }),
        (experiences) => {
          const sorted = sortExperiences(experiences)

          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].startDate >= sorted[i + 1].startDate).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('sortExperiences does not mutate the original array', () => {
    fc.assert(
      fc.property(
        mixedExperiencesArb,
        (experiences) => {
          const original = experiences.map((e) => ({ ...e }))
          sortExperiences(experiences)

          expect(experiences).toEqual(original)
        }
      ),
      { numRuns: 100 }
    )
  })
})
