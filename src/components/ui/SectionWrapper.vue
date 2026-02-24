<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: null
  },
  aos: {
    type: String,
    default: 'fade-up'
  }
})
</script>

<template>
  <section
    :id="id"
    :data-aos="aos"
    class="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
  >
    <h2
      v-if="title"
      class="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
