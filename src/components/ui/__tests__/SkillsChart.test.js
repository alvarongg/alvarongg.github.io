import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SkillsChart from '../SkillsChart.vue'

// Mock useTheme
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

describe('SkillsChart', () => {
  const sampleSkills = [
    { name: 'Python', level: 88, icon: 'devicon-python-plain' },
    { name: 'AWS', level: 90, icon: 'devicon-amazonwebservices-original' },
    { name: 'Linux', level: 80, icon: 'devicon-linux-plain' }
  ]

  it('shows "Sin datos" when skills array is empty', () => {
    const wrapper = mount(SkillsChart, { props: { skills: [] } })
    expect(wrapper.text()).toContain('Sin datos')
  })

  it('shows "Sin datos" when skills prop is not provided', () => {
    const wrapper = mount(SkillsChart)
    expect(wrapper.text()).toContain('Sin datos')
  })

  it('renders an SVG when skills are provided', () => {
    const wrapper = mount(SkillsChart, {
      props: { skills: sampleSkills },
      attachTo: document.body
    })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders one .skill-bar-group per skill', () => {
    const wrapper = mount(SkillsChart, {
      props: { skills: sampleSkills },
      attachTo: document.body
    })
    const groups = wrapper.find('svg').findAll('.skill-bar-group')
    expect(groups.length).toBe(sampleSkills.length)
    wrapper.unmount()
  })

  it('clears previous SVG content on re-render', async () => {
    const wrapper = mount(SkillsChart, {
      props: { skills: sampleSkills },
      attachTo: document.body
    })

    // Update with different skills
    await wrapper.setProps({
      skills: [{ name: 'Go', level: 70, icon: 'devicon-go-plain' }]
    })

    const groups = wrapper.find('svg').findAll('.skill-bar-group')
    expect(groups.length).toBe(1)
    wrapper.unmount()
  })
})
