<script setup>
import personal from '@/data/personal.js'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'

const { copied, copy } = useCopyToClipboard()

function copyEmail() {
  copy(personal.email)
}
</script>

<template>
  <SectionWrapper id="hero" :aos="'fade-in'">
    <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <!-- Profile Image -->
      <div class="flex-shrink-0">
        <img
          :src="personal.profileImage"
          :alt="personal.fullName"
          class="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover shadow-lg ring-4 ring-blue-500/30 dark:ring-blue-400/30"
        />
      </div>

      <!-- Info -->
      <div class="text-center md:text-left space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          {{ personal.fullName }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium">
          {{ personal.title }}
        </p>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ personal.subtitle }}
        </p>
        <p class="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400">
          <i class="fas fa-map-marker-alt" />
          <span>{{ personal.location }}</span>
        </p>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
          <!-- Copy Email Button -->
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            :class="copied
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'"
            @click="copyEmail"
          >
            <i :class="copied ? 'fas fa-check' : 'fas fa-envelope'" />
            <span>{{ copied ? 'Copied!' : personal.email }}</span>
          </button>

          <!-- Download CV -->
          <a
            :href="personal.cvLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <i class="fas fa-download" />
            <span>Download CV</span>
          </a>
        </div>

        <!-- Social Links -->
        <div class="pt-2">
          <SocialLinks :links="personal.socialLinks" />
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
