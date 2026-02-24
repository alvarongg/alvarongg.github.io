/**
 * Feature: portfolio-vue-modernization, Property 4: Round-trip de copiar al portapapeles
 * Validates: Requirements 3.2, 10.2
 *
 * For any non-empty string, calling copy() sets copied=true immediately,
 * the clipboard receives the exact string, and after the 2-second timeout
 * copied returns to false.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import fc from 'fast-check'
import { useCopyToClipboard } from '../useCopyToClipboard.js'

describe('Feature: portfolio-vue-modernization, Property 4: Round-trip de copiar al portapapeles', () => {
  let writeTextMock

  beforeEach(() => {
    vi.useFakeTimers()
    writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Generator: non-empty arbitrary strings (printable unicode)
  const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 200 })

  test('for any non-empty string, copy() sets copied=true, calls writeText with the exact string, then resets to false after 2s', async () => {
    await fc.assert(
      fc.asyncProperty(nonEmptyStringArb, async (text) => {
        const { copied, copy } = useCopyToClipboard()

        // Pre-condition: copied starts false
        expect(copied.value).toBe(false)

        // Act
        await copy(text)

        // copied must be true immediately after copy resolves
        expect(copied.value).toBe(true)

        // clipboard.writeText must have been called with the exact string
        expect(writeTextMock).toHaveBeenCalledWith(text)

        // Advance time by 2 seconds — copied must reset to false
        vi.advanceTimersByTime(2000)
        expect(copied.value).toBe(false)

        // Reset mock call history for next iteration
        writeTextMock.mockClear()
      }),
      { numRuns: 100 }
    )
  })
})
