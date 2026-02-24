<script setup>
import education from '@/data/education.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import CertificationCard from '@/components/ui/CertificationCard.vue'
</script>

<template>
  <SectionWrapper id="education" title="Education">
    <!-- Formal Education -->
    <div class="mb-12">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Formal Education
      </h3>
      <div class="space-y-4">
        <div
          v-for="degree in education.degrees"
          :key="degree.title"
          class="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ degree.title }}
          </h4>
          <a
            :href="degree.institutionUrl"
            target="_blank"
            rel="noopener"
            class="mt-1 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ degree.institution }}
          </a>
          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{{ degree.year }}</span>
            <span v-if="degree.average">GPA: {{ degree.average }}</span>
            <span>{{ degree.location }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Certifications -->
    <div class="mb-12">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Certifications
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CertificationCard
          v-for="cert in education.certifications"
          :key="cert.title"
          :certification="cert"
        />
      </div>
    </div>

    <!-- Courses (only show if there are courses) -->
    <div v-if="education.courses && education.courses.length">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Courses
      </h3>
      <div class="space-y-4">
        <div
          v-for="course in education.courses"
          :key="course.title"
          class="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ course.title }}
          </h4>
          <a
            :href="course.institutionUrl"
            target="_blank"
            rel="noopener"
            class="mt-1 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ course.institution }}
          </a>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ course.description }}
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
