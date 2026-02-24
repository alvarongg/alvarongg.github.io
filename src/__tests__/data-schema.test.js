/**
 * Feature: portfolio-vue-modernization, Property 1: Validación de esquema de datos
 * Validates: Requirements 2.1, 5.4
 *
 * Verifies that each exported data module conforms to its expected schema.
 * Uses fast-check to generate variations and validate structure.
 */
import { describe, test, expect } from 'vitest'
import fc from 'fast-check'

import personal from '@/data/personal.js'
import skills from '@/data/skills.js'
import experience from '@/data/experience.js'
import education from '@/data/education.js'
import projects from '@/data/projects.js'
import hobbies from '@/data/hobbies.js'

// --- Schema validators ---

function isNonEmptyString(val) {
  return typeof val === 'string' && val.length > 0
}

function validatePersonalSchema(data) {
  expect(data).toHaveProperty('fullName')
  expect(data).toHaveProperty('title')
  expect(data).toHaveProperty('location')
  expect(data).toHaveProperty('email')
  expect(data).toHaveProperty('socialLinks')
  expect(data).toHaveProperty('aboutMe')
  expect(isNonEmptyString(data.fullName)).toBe(true)
  expect(isNonEmptyString(data.title)).toBe(true)
  expect(isNonEmptyString(data.location)).toBe(true)
  expect(isNonEmptyString(data.email)).toBe(true)
  expect(Array.isArray(data.socialLinks)).toBe(true)
  expect(data.socialLinks.length).toBeGreaterThan(0)
  data.socialLinks.forEach((link) => {
    expect(isNonEmptyString(link.name)).toBe(true)
    expect(isNonEmptyString(link.url)).toBe(true)
    expect(isNonEmptyString(link.icon)).toBe(true)
  })
  expect(Array.isArray(data.aboutMe)).toBe(true)
  expect(data.aboutMe.length).toBeGreaterThan(0)
}

function validateSkillsSchema(data) {
  expect(data).toHaveProperty('technical')
  expect(data).toHaveProperty('soft')
  expect(data).toHaveProperty('languages')
  expect(Array.isArray(data.technical)).toBe(true)
  expect(Array.isArray(data.soft)).toBe(true)
  expect(Array.isArray(data.languages)).toBe(true)
  data.technical.forEach((skill) => {
    expect(isNonEmptyString(skill.name)).toBe(true)
    expect(isNonEmptyString(skill.icon)).toBe(true)
    expect(Array.isArray(skill.details)).toBe(true)
    expect(typeof skill.level).toBe('number')
  })
  data.soft.forEach((skill) => {
    expect(isNonEmptyString(skill.name)).toBe(true)
    expect(isNonEmptyString(skill.icon)).toBe(true)
  })
  data.languages.forEach((lang) => {
    expect(isNonEmptyString(lang.name)).toBe(true)
    expect(isNonEmptyString(lang.level)).toBe(true)
  })
}

function validateExperienceSchema(data) {
  expect(Array.isArray(data)).toBe(true)
  data.forEach((item) => {
    expect(isNonEmptyString(item.id)).toBe(true)
    expect(isNonEmptyString(item.title)).toBe(true)
    expect(isNonEmptyString(item.company)).toBe(true)
    expect(isNonEmptyString(item.period)).toBe(true)
    expect(isNonEmptyString(item.startDate)).toBe(true)
    expect(isNonEmptyString(item.description)).toBe(true)
  })
}

function validateEducationSchema(data) {
  expect(data).toHaveProperty('degrees')
  expect(data).toHaveProperty('certifications')
  expect(data).toHaveProperty('courses')
  expect(Array.isArray(data.degrees)).toBe(true)
  expect(Array.isArray(data.certifications)).toBe(true)
  expect(Array.isArray(data.courses)).toBe(true)
}

function validateProjectsSchema(data) {
  expect(Array.isArray(data)).toBe(true)
  data.forEach((item) => {
    expect(isNonEmptyString(item.id)).toBe(true)
    expect(isNonEmptyString(item.title)).toBe(true)
    expect(isNonEmptyString(item.description)).toBe(true)
    expect(isNonEmptyString(item.type)).toBe(true)
    expect(Array.isArray(item.links)).toBe(true)
  })
}

function validateHobbiesSchema(data) {
  expect(Array.isArray(data)).toBe(true)
  data.forEach((item) => {
    expect(isNonEmptyString(item.name)).toBe(true)
    expect(isNonEmptyString(item.icon)).toBe(true)
    expect(isNonEmptyString(item.description)).toBe(true)
  })
}

// --- Actual data validation tests ---

describe('Feature: portfolio-vue-modernization, Property 1: Validación de esquema de datos', () => {
  test('personal data conforms to expected schema', () => {
    validatePersonalSchema(personal)
  })

  test('skills data conforms to expected schema', () => {
    validateSkillsSchema(skills)
  })

  test('experience data conforms to expected schema', () => {
    validateExperienceSchema(experience)
  })

  test('education data conforms to expected schema', () => {
    validateEducationSchema(education)
  })

  test('projects data conforms to expected schema', () => {
    validateProjectsSchema(projects)
  })

  test('hobbies data conforms to expected schema', () => {
    validateHobbiesSchema(hobbies)
  })

  // --- Property-based tests with fast-check generators ---

  test('schema validator correctly accepts valid skills objects', () => {
    const technicalSkillArb = fc.record({
      name: fc.string({ minLength: 1 }),
      icon: fc.string({ minLength: 1 }),
      details: fc.array(fc.string({ minLength: 1 })),
      level: fc.integer({ min: 0, max: 100 }),
    })
    const softSkillArb = fc.record({
      name: fc.string({ minLength: 1 }),
      icon: fc.string({ minLength: 1 }),
    })
    const languageArb = fc.record({
      name: fc.string({ minLength: 1 }),
      level: fc.string({ minLength: 1 }),
    })
    const skillsArb = fc.record({
      technical: fc.array(technicalSkillArb, { minLength: 1 }),
      soft: fc.array(softSkillArb, { minLength: 1 }),
      languages: fc.array(languageArb, { minLength: 1 }),
    })

    fc.assert(
      fc.property(skillsArb, (generatedSkills) => {
        // Every generated valid skills object must pass validation
        expect(() => validateSkillsSchema(generatedSkills)).not.toThrow()
      }),
      { numRuns: 100 }
    )
  })

  test('schema validator correctly accepts valid experience arrays', () => {
    const experienceItemArb = fc.record({
      id: fc.string({ minLength: 1 }),
      title: fc.string({ minLength: 1 }),
      company: fc.string({ minLength: 1 }),
      period: fc.string({ minLength: 1 }),
      startDate: fc.tuple(
        fc.integer({ min: 2000, max: 2030 }),
        fc.integer({ min: 1, max: 12 })
      ).map(([y, m]) => `${y}-${String(m).padStart(2, '0')}`),
      description: fc.string({ minLength: 1 }),
    })

    fc.assert(
      fc.property(fc.array(experienceItemArb, { minLength: 1 }), (generatedExp) => {
        expect(() => validateExperienceSchema(generatedExp)).not.toThrow()
      }),
      { numRuns: 100 }
    )
  })

  test('schema validator correctly accepts valid education objects', () => {
    const educationArb = fc.record({
      degrees: fc.array(fc.record({
        title: fc.string({ minLength: 1 }),
        institution: fc.string({ minLength: 1 }),
      })),
      certifications: fc.array(fc.record({
        title: fc.string({ minLength: 1 }),
        issuer: fc.string({ minLength: 1 }),
      })),
      courses: fc.array(fc.record({
        title: fc.string({ minLength: 1 }),
        institution: fc.string({ minLength: 1 }),
      })),
    })

    fc.assert(
      fc.property(educationArb, (generatedEdu) => {
        expect(() => validateEducationSchema(generatedEdu)).not.toThrow()
      }),
      { numRuns: 100 }
    )
  })

  test('schema validator correctly accepts valid projects arrays', () => {
    const projectArb = fc.record({
      id: fc.string({ minLength: 1 }),
      title: fc.string({ minLength: 1 }),
      description: fc.string({ minLength: 1 }),
      type: fc.constantFrom('project', 'talk', 'event'),
      links: fc.array(fc.record({
        label: fc.string({ minLength: 1 }),
        url: fc.string({ minLength: 1 }),
        icon: fc.string({ minLength: 1 }),
      })),
    })

    fc.assert(
      fc.property(fc.array(projectArb, { minLength: 1 }), (generatedProjects) => {
        expect(() => validateProjectsSchema(generatedProjects)).not.toThrow()
      }),
      { numRuns: 100 }
    )
  })

  test('schema validator correctly accepts valid hobbies arrays', () => {
    const hobbyArb = fc.record({
      name: fc.string({ minLength: 1 }),
      icon: fc.string({ minLength: 1 }),
      description: fc.string({ minLength: 1 }),
    })

    fc.assert(
      fc.property(fc.array(hobbyArb, { minLength: 1 }), (generatedHobbies) => {
        expect(() => validateHobbiesSchema(generatedHobbies)).not.toThrow()
      }),
      { numRuns: 100 }
    )
  })

  test('schema validator rejects invalid data structures', () => {
    // Generate arbitrary objects that are missing required fields
    fc.assert(
      fc.property(fc.anything(), (randomData) => {
        // Skills without required keys should fail
        if (
          randomData === null ||
          randomData === undefined ||
          typeof randomData !== 'object' ||
          Array.isArray(randomData) ||
          !('technical' in randomData) ||
          !('soft' in randomData) ||
          !('languages' in randomData)
        ) {
          expect(() => validateSkillsSchema(randomData)).toThrow()
        }
      }),
      { numRuns: 100 }
    )
  })

  test('schema validator rejects experience items with missing required fields', () => {
    // Generate objects missing at least one required field
    const incompleteExpArb = fc.record({
      id: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      company: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      period: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      startDate: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      description: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
    }).filter((obj) => {
      // Keep only objects where at least one required field is missing
      return !obj.id || !obj.title || !obj.company || !obj.period || !obj.startDate || !obj.description
    })

    fc.assert(
      fc.property(fc.array(incompleteExpArb, { minLength: 1, maxLength: 3 }), (invalidExp) => {
        expect(() => validateExperienceSchema(invalidExp)).toThrow()
      }),
      { numRuns: 100 }
    )
  })
})
