<script setup>
import hobbies from '@/data/hobbies.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
</script>

<template>
  <SectionWrapper id="hobbies" title="Hobbies">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="hobby in hobbies"
        :key="hobby.name"
        class="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        <i :class="hobby.icon" class="text-4xl mb-4 text-blue-600 dark:text-blue-400" />
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {{ hobby.name }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {{ hobby.description }}
        </p>
        <div v-if="hobby.links && hobby.links.length" class="flex flex-wrap justify-center gap-2 mt-auto">
          <a
            v-for="link in hobby.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <i v-if="link.icon" :class="link.icon" class="text-xs" />
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
