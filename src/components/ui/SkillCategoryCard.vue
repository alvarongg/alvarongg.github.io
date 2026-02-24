<script setup>
defineProps({
  skill: {
    type: Object,
    required: true,
    validator: (v) => v.name && v.icon
  }
})
</script>

<template>
  <div class="rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
    <div class="flex items-center gap-3 mb-3">
      <i :class="skill.icon" class="text-3xl text-blue-600 dark:text-blue-400" />
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
            {{ skill.name }}
          </h3>
          <span
            v-if="skill.level != null"
            class="text-sm font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0"
          >
            {{ skill.level }}%
          </span>
        </div>
        <div v-if="skill.level != null" class="mt-1.5">
          <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500"
              :style="{ width: skill.level + '%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="skill.details && skill.details.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="detail in skill.details"
        :key="detail"
        class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        {{ detail }}
      </span>
    </div>
  </div>
</template>
