import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useScrollSpy } from '../useScrollSpy.js'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

// Helper to mount a composable inside a real component lifecycle
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

describe('useScrollSpy', () => {
  let observeMock, disconnectMock, observerCallback, constructorArgs

  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()
    constructorArgs = null

    // Mock IntersectionObserver as a class
    global.IntersectionObserver = class {
      constructor(callback, options) {
        observerCallback = callback
        constructorArgs = { callback, options }
        this.observe = observeMock
        this.disconnect = disconnectMock
        this.unobserve = vi.fn()
      }
    }
  })

  it('returns activeSection ref defaulting to first section id', () => {
    const { result } = withSetup(() => useScrollSpy(['hero', 'about', 'skills']))
    expect(result.activeSection.value).toBe('hero')
  })

  it('creates IntersectionObserver with correct rootMargin on mount', () => {
    // Create DOM elements for the sections
    const ids = ['hero', 'about']
    ids.forEach((id) => {
      const el = document.createElement('div')
      el.id = id
      document.body.appendChild(el)
    })

    withSetup(() => useScrollSpy(ids))

    expect(constructorArgs.options).toEqual({ rootMargin: '-20% 0px -70% 0px' })

    // Cleanup
    ids.forEach((id) => document.getElementById(id)?.remove())
  })

  it('observes each section element that exists in the DOM', () => {
    const ids = ['hero', 'about', 'missing']
    ids.slice(0, 2).forEach((id) => {
      const el = document.createElement('div')
      el.id = id
      document.body.appendChild(el)
    })

    withSetup(() => useScrollSpy(ids))

    // Only 2 elements exist, so observe should be called twice
    expect(observeMock).toHaveBeenCalledTimes(2)

    // Cleanup
    ids.forEach((id) => document.getElementById(id)?.remove())
  })

  it('updates activeSection when an entry is intersecting', async () => {
    const ids = ['hero', 'about']
    ids.forEach((id) => {
      const el = document.createElement('div')
      el.id = id
      document.body.appendChild(el)
    })

    const { result } = withSetup(() => useScrollSpy(ids))
    expect(result.activeSection.value).toBe('hero')

    // Simulate intersection
    observerCallback([
      { isIntersecting: true, target: { id: 'about' } }
    ])
    await nextTick()
    expect(result.activeSection.value).toBe('about')

    // Cleanup
    ids.forEach((id) => document.getElementById(id)?.remove())
  })

  it('ignores entries that are not intersecting', async () => {
    const ids = ['hero', 'about']
    ids.forEach((id) => {
      const el = document.createElement('div')
      el.id = id
      document.body.appendChild(el)
    })

    const { result } = withSetup(() => useScrollSpy(ids))

    observerCallback([
      { isIntersecting: false, target: { id: 'about' } }
    ])
    await nextTick()
    expect(result.activeSection.value).toBe('hero')

    // Cleanup
    ids.forEach((id) => document.getElementById(id)?.remove())
  })

  it('disconnects observer on unmount', () => {
    const ids = ['hero']
    ids.forEach((id) => {
      const el = document.createElement('div')
      el.id = id
      document.body.appendChild(el)
    })

    const { wrapper } = withSetup(() => useScrollSpy(ids))
    wrapper.unmount()

    expect(disconnectMock).toHaveBeenCalled()

    // Cleanup
    ids.forEach((id) => document.getElementById(id)?.remove())
  })

  it('handles missing IntersectionObserver gracefully (SSR/test)', () => {
    delete global.IntersectionObserver

    const { result } = withSetup(() => useScrollSpy(['hero', 'about']))

    // Should still return the default activeSection without errors
    expect(result.activeSection.value).toBe('hero')
  })
})
