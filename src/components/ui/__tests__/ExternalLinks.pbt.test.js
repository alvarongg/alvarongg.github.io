/**
 * Feature: portfolio-vue-modernization, Property 8: Enlaces externos abren en nueva pestaña
 * Validates: Requirements 7.2, 8.2, 8.4
 *
 * Verifies that all rendered <a> elements with external URLs have
 * target="_blank" and rel="noopener" attributes.
 */
import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import CertificationCard from '../CertificationCard.vue'
import ProjectCard from '../ProjectCard.vue'

// Generator for realistic external URLs
const externalUrlArb = fc.tuple(
  fc.constantFrom('https', 'http'),
  fc.stringMatching(/^[a-z][a-z0-9]{2,12}$/).filter(s => s.length >= 3),
  fc.constantFrom('.com', '.org', '.io', '.net', '.dev'),
  fc.stringMatching(/^\/[a-z0-9\-]{1,20}$/).map(p => p || '')
).map(([proto, domain, tld, path]) => `${proto}://${domain}${tld}${path}`)

// --- CertificationCard generators ---

const certificationWithCredlyArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 60 }),
  issuer: fc.string({ minLength: 1, maxLength: 40 }),
  date: fc.string({ minLength: 1, maxLength: 20 }),
  credlyUrl: externalUrlArb,
  credentialId: fc.option(fc.stringMatching(/^[A-Z0-9]{6,12}$/), { nil: null }),
})

// --- ProjectCard generators ---

const fontAwesomeIconArb = fc.constantFrom(
  'fab fa-youtube', 'fab fa-github', 'fas fa-link',
  'fab fa-linkedin', 'fas fa-globe', 'fab fa-twitter'
)

const projectLinkArb = fc.record({
  label: fc.string({ minLength: 1, maxLength: 30 }),
  url: externalUrlArb,
  icon: fontAwesomeIconArb,
})

const projectArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  image: fc.constant(null),
  type: fc.constantFrom('project', 'talk', 'event'),
  technologies: fc.array(
    fc.constantFrom('aws', 'python', 'javascript', 'docker', 'vue'),
    { minLength: 0, maxLength: 3 }
  ),
  links: fc.array(projectLinkArb, { minLength: 1, maxLength: 4 }),
})

describe('Feature: portfolio-vue-modernization, Property 8: Enlaces externos abren en nueva pestaña', () => {
  describe('CertificationCard: credlyUrl links have target="_blank" and rel="noopener"', () => {
    test('when credlyUrl is provided, the <a> element has target="_blank" and rel="noopener"', () => {
      fc.assert(
        fc.property(certificationWithCredlyArb, (certification) => {
          const wrapper = mount(CertificationCard, {
            props: { certification },
          })

          const anchors = wrapper.findAll('a')
          expect(anchors.length).toBeGreaterThanOrEqual(1)

          for (const anchor of anchors) {
            expect(anchor.attributes('target')).toBe('_blank')
            expect(anchor.attributes('rel')).toBe('noopener')
          }

          wrapper.unmount()
        }),
        { numRuns: 100 }
      )
    })

    test('credlyUrl href matches the provided URL', () => {
      fc.assert(
        fc.property(certificationWithCredlyArb, (certification) => {
          const wrapper = mount(CertificationCard, {
            props: { certification },
          })

          const anchor = wrapper.find('a')
          expect(anchor.exists()).toBe(true)
          expect(anchor.attributes('href')).toBe(certification.credlyUrl)

          wrapper.unmount()
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('ProjectCard: all link <a> elements have target="_blank" and rel="noopener"', () => {
    test('every rendered link has target="_blank" and rel="noopener"', () => {
      fc.assert(
        fc.property(projectArb, (project) => {
          const wrapper = mount(ProjectCard, {
            props: { project },
          })

          const anchors = wrapper.findAll('a')
          expect(anchors.length).toBe(project.links.length)

          for (const anchor of anchors) {
            expect(anchor.attributes('target')).toBe('_blank')
            expect(anchor.attributes('rel')).toBe('noopener')
          }

          wrapper.unmount()
        }),
        { numRuns: 100 }
      )
    })

    test('each link href matches the corresponding project link URL', () => {
      fc.assert(
        fc.property(projectArb, (project) => {
          const wrapper = mount(ProjectCard, {
            props: { project },
          })

          const anchors = wrapper.findAll('a')
          const renderedHrefs = anchors.map(a => a.attributes('href'))

          for (const link of project.links) {
            expect(renderedHrefs).toContain(link.url)
          }

          wrapper.unmount()
        }),
        { numRuns: 100 }
      )
    })
  })
})
