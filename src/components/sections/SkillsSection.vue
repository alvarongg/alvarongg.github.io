<script setup>
import skills from '@/data/skills.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import SkillCategoryCard from '@/components/ui/SkillCategoryCard.vue'
</script>

<template>
  <SectionWrapper id="skills" title="Skills">
    <!-- Technical Skills -->
    <div class="mb-12">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Technical Skills
      </h3>

      <!-- Skill Category Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkillCategoryCard
          v-for="skill in skills.technical"
          :key="skill.name"
          :skill="skill"
        />
      </div>
    </div>

    <!-- Soft Skills -->
    <div class="mb-12">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Soft Skills
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="skill in skills.soft"
          :key="skill.name"
          class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <i :class="skill.icon" class="text-2xl text-blue-600 dark:text-blue-400" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div>
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Languages
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="lang in skills.languages"
          :key="lang.name"
          class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center gap-3">
            <span v-if="lang.flags && lang.flags.length" class="text-2xl flex gap-1">
              <span v-for="flag in lang.flags" :key="flag">{{ flag }}</span>
            </span>
            <span class="font-medium text-gray-800 dark:text-gray-100">
              {{ lang.name }}
            </span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ lang.level }}
          </span>
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
