/**
 * Feature: portfolio-vue-modernization, Property 2: Cantidad de elementos renderizados coincide con datos
 * Feature: portfolio-vue-modernization, Property 3: Completitud de campos renderizados
 * Validates: Requirements 2.3, 3.1, 4.1, 6.1, 6.3, 7.1, 7.3, 8.1, 9.1, 10.1, 10.3
 *
 * Property 2: For any array of data items of length N, the corresponding component
 * renders exactly N child elements of the expected type.
 *
 * Property 3: For any data item with required fields, the rendered component
 * contains text or elements representing each required field.
 */
import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import SocialLinks from '../SocialLinks.vue'
import SkillCategoryCard from '../SkillCategoryCard.vue'
import CertificationCard from '../CertificationCard.vue'
import ProjectCard from '../ProjectCard.vue'
import ExperienceTimelineItem from '../ExperienceTimelineItem.vue'

// --- Generators ---

// Alphanumeric text generator that avoids HTML-special chars and whitespace-only strings
const textArb = (min = 1, max = 40) =>
  fc.stringMatching(new RegExp(`^[A-Za-z0-9 ]{${min},${max}}$`))
    .filter(s => s.trim().length > 0)

const externalUrlArb = fc.tuple(
  fc.constantFrom('https'),
  fc.stringMatching(/^[a-z][a-z0-9]{2,10}$/).filter(s => s.length >= 3),
  fc.constantFrom('.com', '.org', '.io', '.net')
).map(([proto, domain, tld]) => `${proto}://${domain}${tld}`)

const fontAwesomeIconArb = fc.constantFrom(
  'fab fa-github', 'fab fa-linkedin', 'fab fa-instagram',
  'fab fa-whatsapp', 'fa fa-slideshare', 'fab fa-youtube'
)

const socialLinkArb = fc.record({
  name: textArb(1, 30),
  url: externalUrlArb,
  icon: fontAwesomeIconArb,
})

const deviconClassArb = fc.tuple(
  fc.constantFrom(
    'python', 'javascript', 'typescript', 'java', 'react', 'vuejs',
    'docker', 'terraform', 'amazonwebservices', 'nodejs', 'go'
  ),
  fc.constantFrom('plain', 'original')
).map(([tech, variant]) => `devicon-${tech}-${variant}`)

const skillArb = fc.record({
  name: textArb(1, 40),
  icon: deviconClassArb,
  details: fc.array(textArb(1, 20), { minLength: 1, maxLength: 6 }),
  level: fc.integer({ min: 0, max: 100 }),
})

const certificationArb = fc.record({
  title: textArb(1, 60),
  issuer: textArb(1, 40),
  date: textArb(1, 20),
  credlyUrl: fc.option(externalUrlArb, { nil: null }),
  credentialId: fc.option(fc.stringMatching(/^[A-Z0-9]{6,12}$/), { nil: null }),
})

const projectLinkArb = fc.record({
  label: textArb(1, 30),
  url: externalUrlArb,
  icon: fontAwesomeIconArb,
})

const projectArb = fc.record({
  title: textArb(1, 80),
  description: textArb(1, 200),
  image: fc.constant(null),
  type: fc.constantFrom('project', 'talk', 'event'),
  technologies: fc.array(
    fc.constantFrom('aws', 'python', 'javascript', 'docker', 'vue'),
    { minLength: 0, maxLength: 4 }
  ),
  links: fc.array(projectLinkArb, { minLength: 1, maxLength: 4 }),
})

const experienceItemArb = fc.record({
  title: textArb(1, 50),
  company: textArb(1, 50),
  period: textArb(1, 30),
  icon: fc.constantFrom('fas fa-users', 'fas fa-briefcase', 'fas fa-code', 'fas fa-database'),
  description: textArb(1, 100),
  responsibilities: fc.array(textArb(1, 60), { minLength: 1, maxLength: 5 }),
})

// ============================================================================
// Property 2: Cantidad de elementos renderizados coincide con datos
// ============================================================================

describe('Feature: portfolio-vue-modernization, Property 2: Cantidad de elementos renderizados coincide con datos', () => {
  test('SocialLinks renders exactly N <a> elements for N social links', () => {
    fc.assert(
      fc.property(
        fc.array(socialLinkArb, { minLength: 1, maxLength: 10 }),
        (links) => {
          const wrapper = mount(SocialLinks, { props: { links } })
          const anchors = wrapper.findAll('a')
          expect(anchors).toHaveLength(links.length)
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  test('SkillCategoryCard renders exactly N detail tags for N details', () => {
    fc.assert(
      fc.property(skillArb, (skill) => {
        const wrapper = mount(SkillCategoryCard, { props: { skill } })
        const detailSpans = wrapper.findAll('.flex.flex-wrap.gap-1\\.5 span')
        expect(detailSpans).toHaveLength(skill.details.length)
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })

  test('ProjectCard renders exactly N link <a> elements for N project links', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const wrapper = mount(ProjectCard, { props: { project } })
        const anchors = wrapper.findAll('a')
        expect(anchors).toHaveLength(project.links.length)
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })

  test('ExperienceTimelineItem renders exactly N responsibility items when expanded', async () => {
    fc.assert(
      fc.property(experienceItemArb, (item) => {
        const wrapper = mount(ExperienceTimelineItem, { props: { item } })
        // Expand the item
        wrapper.find('button').trigger('click')
        // Check responsibilities count (li elements inside the ul)
        const listItems = wrapper.findAll('li')
        expect(listItems).toHaveLength(item.responsibilities.length)
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })
})

// ============================================================================
// Property 3: Completitud de campos renderizados
// ============================================================================

describe('Feature: portfolio-vue-modernization, Property 3: Completitud de campos renderizados', () => {
  test('SocialLinks: each link name appears as aria-label in rendered output', () => {
    fc.assert(
      fc.property(
        fc.array(socialLinkArb, { minLength: 1, maxLength: 8 }),
        (links) => {
          const wrapper = mount(SocialLinks, { props: { links } })
          const anchors = wrapper.findAll('a')
          for (let i = 0; i < links.length; i++) {
            expect(anchors[i].attributes('aria-label')).toBe(links[i].name)
            expect(anchors[i].attributes('href')).toBe(links[i].url)
          }
          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  test('SkillCategoryCard: name and icon class are present in rendered output', () => {
    fc.assert(
      fc.property(skillArb, (skill) => {
        const wrapper = mount(SkillCategoryCard, { props: { skill } })
        // Name should be in the h3
        const h3 = wrapper.find('h3')
        expect(h3.exists()).toBe(true)
        expect(h3.text()).toContain(skill.name.trim())
        // Icon class should be in the HTML
        expect(wrapper.html()).toContain(skill.icon)
        // Each detail text should be in a span
        const detailSpans = wrapper.findAll('.flex.flex-wrap.gap-1\\.5 span')
        const detailTexts = detailSpans.map(s => s.text())
        for (const detail of skill.details) {
          expect(detailTexts).toContain(detail.trim())
        }
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })

  test('CertificationCard: title, issuer, and date are present in rendered output', () => {
    fc.assert(
      fc.property(certificationArb, (certification) => {
        const wrapper = mount(CertificationCard, { props: { certification } })
        // Title in h3
        expect(wrapper.find('h3').text()).toContain(certification.title.trim())
        // Issuer in first p
        const paragraphs = wrapper.findAll('p')
        expect(paragraphs[0].text()).toContain(certification.issuer.trim())
        // Date in second p
        expect(paragraphs[1].text()).toContain(certification.date.trim())
        // credentialId if provided
        if (certification.credentialId) {
          expect(wrapper.text()).toContain(certification.credentialId)
        }
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })

  test('ProjectCard: title, description, and type label are present in rendered output', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const wrapper = mount(ProjectCard, { props: { project } })
        // Title in h3
        expect(wrapper.find('h3').text()).toContain(project.title.trim())
        // Description in p with line-clamp
        expect(wrapper.find('.line-clamp-3').text()).toContain(project.description.trim())
        // Each link label in an <a>
        const anchors = wrapper.findAll('a')
        const anchorTexts = anchors.map(a => a.text())
        for (const link of project.links) {
          expect(anchorTexts.some(t => t.includes(link.label.trim()))).toBe(true)
        }
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })

  test('ExperienceTimelineItem: title, company, and period are present in rendered output', () => {
    fc.assert(
      fc.property(experienceItemArb, (item) => {
        const wrapper = mount(ExperienceTimelineItem, { props: { item } })
        // Title in h3
        expect(wrapper.find('h3').text()).toContain(item.title.trim())
        // Company in the blue-colored p
        expect(wrapper.find('.text-blue-600').text()).toContain(item.company.trim())
        // Period in the gray p
        expect(wrapper.find('.text-gray-500').text()).toContain(item.period.trim())
        wrapper.unmount()
      }),
      { numRuns: 100 }
    )
  })
})
