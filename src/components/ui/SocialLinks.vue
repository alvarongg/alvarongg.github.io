<script setup>
defineProps({
  links: {
    type: Array,
    required: true,
    validator: (v) => v.every((l) => l.name && l.url && l.icon),
  },
})
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <a
      v-for="link in links"
      :key="link.name"
      :href="link.url"
      target="_blank"
      rel="noopener"
      :aria-label="link.name"
      class="inline-flex items-center justify-center w-10 h-10 rounded-full text-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-lg hover:scale-110 transition-all duration-300"
    >
      <i :class="link.icon" />
    </a>
  </div>
</template>
