<script setup>
import personal from '@/data/personal.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
</script>

<template>
  <SectionWrapper id="about" title="About Me">
    <div class="max-w-3xl mx-auto space-y-5">
      <p
        v-for="(paragraph, index) in personal.aboutMe"
        :key="index"
        class="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
      >
        {{ paragraph }}
      </p>
    </div>
  </SectionWrapper>
</template>
