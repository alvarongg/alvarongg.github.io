<script setup>
import experiences from '@/data/experience.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import ExperienceTimelineItem from '@/components/ui/ExperienceTimelineItem.vue'
import { sortExperiences } from '@/components/sections/experienceUtils.js'

const sortedExperiences = sortExperiences(experiences)
</script>

<template>
  <SectionWrapper id="experience" title="Experience">
    <div class="max-w-3xl mx-auto">
      <ExperienceTimelineItem
        v-for="exp in sortedExperiences"
        :key="exp.id"
        :item="exp"
      />
    </div>
  </SectionWrapper>
</template>
