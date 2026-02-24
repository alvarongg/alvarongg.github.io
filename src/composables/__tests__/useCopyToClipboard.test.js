import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useCopyToClipboard } from '../useCopyToClipboard.js'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Mock Clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
    // Ensure execCommand exists for jsdom (deprecated but needed for fallback tests)
    if (!document.execCommand) {
      document.execCommand = vi.fn().mockReturnValue(true)
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns copied ref and copy function', () => {
    const { copied, copy } = useCopyToClipboard()
    expect(copied.value).toBe(false)
    expect(typeof copy).toBe('function')
  })

  it('each call returns a new independent instance', () => {
    const a = useCopyToClipboard()
    const b = useCopyToClipboard()
    a.copied.value = true
    expect(b.copied.value).toBe(false)
  })

  it('sets copied to true after successful copy', async () => {
    const { copied, copy } = useCopyToClipboard()
    await copy('hello')
    expect(copied.value).toBe(true)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
  })

  it('resets copied to false after 2 seconds', async () => {
    const { copied, copy } = useCopyToClipboard()
    await copy('hello')
    expect(copied.value).toBe(true)

    vi.advanceTimersByTime(2000)
    expect(copied.value).toBe(false)
  })

  it('uses fallback when Clipboard API fails', async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Not allowed'))
    const execCommandSpy = vi.spyOn(document, 'execCommand').mockReturnValue(true)

    const { copied, copy } = useCopyToClipboard()
    await copy('fallback text')

    expect(copied.value).toBe(true)
    expect(execCommandSpy).toHaveBeenCalledWith('copy')
  })

  it('does not crash when both methods fail', async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Not allowed'))
    vi.spyOn(document, 'execCommand').mockImplementation(() => { throw new Error('execCommand failed') })

    const { copied, copy } = useCopyToClipboard()
    await expect(copy('fail')).resolves.toBeUndefined()
    expect(copied.value).toBe(false)
  })

  it('fallback also resets copied after 2 seconds', async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Not allowed'))
    vi.spyOn(document, 'execCommand').mockReturnValue(true)

    const { copied, copy } = useCopyToClipboard()
    await copy('test')
    expect(copied.value).toBe(true)

    vi.advanceTimersByTime(2000)
    expect(copied.value).toBe(false)
  })
})
