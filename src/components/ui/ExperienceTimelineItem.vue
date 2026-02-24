<script setup>
import { ref } from 'vue'

defineProps({
  item: {
    type: Object,
    required: true,
    validator: (v) => v.title && v.company && v.period
  }
})

const isExpanded = ref(false)

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="relative pl-8 pb-8 border-l-2 border-blue-300 dark:border-blue-600 last:pb-0">
    <!-- Timeline dot -->
    <div
      class="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-400 text-white text-xs shadow"
    >
      <i :class="item.icon" />
    </div>

    <!-- Header (always visible, clickable) -->
    <button
      class="w-full text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-3 -mt-1 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-lg hover:scale-[1.02]"
      :aria-expanded="isExpanded"
      @click="toggle"
    >
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ item.title }}
          </h3>
          <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {{ item.company }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ item.period }}
          </p>
        </div>
        <i
          class="fas fa-chevron-down text-gray-400 dark:text-gray-500 transition-transform duration-300 mt-1"
          :class="{ 'rotate-180': isExpanded }"
        />
      </div>
    </button>

    <!-- Expandable content -->
    <Transition name="expand">
      <div v-show="isExpanded" class="overflow-hidden">
        <div class="px-3 pt-2 pb-1">
          <!-- General description -->
          <p
            v-if="item.description"
            class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
          >
            {{ item.description }}
          </p>

          <!-- Sub-positions (career progression) -->
          <div v-if="item.positions && item.positions.length" class="space-y-5">
            <div
              v-for="(pos, idx) in item.positions"
              :key="idx"
              class="relative pl-5 border-l-2 border-gray-200 dark:border-gray-600"
            >
              <div class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-500" />
              <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {{ pos.title }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ pos.period }}
              </p>
              <p
                v-if="pos.description"
                class="text-sm text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed"
              >
                {{ pos.description }}
              </p>
              <ul
                v-if="pos.responsibilities && pos.responsibilities.length"
                class="mt-2 space-y-1"
              >
                <li
                  v-for="(resp, rIdx) in pos.responsibilities"
                  :key="rIdx"
                  class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <i class="fas fa-check text-blue-500 dark:text-blue-400 mt-1 text-xs flex-shrink-0" />
                  <span>{{ resp }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Legacy format: flat responsibilities -->
          <ul
            v-else-if="item.responsibilities && item.responsibilities.length"
            class="space-y-1.5"
          >
            <li
              v-for="(resp, idx) in item.responsibilities"
              :key="idx"
              class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <i class="fas fa-check text-blue-500 dark:text-blue-400 mt-1 text-xs flex-shrink-0" />
              <span>{{ resp }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 1000px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
