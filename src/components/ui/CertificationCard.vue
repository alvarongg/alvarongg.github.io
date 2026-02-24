<script setup>
defineProps({
  certification: {
    type: Object,
    required: true,
    validator: (v) => v.title && v.issuer,
  },
})
</script>

<template>
  <div
    :class="[
      'rounded-xl border bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300',
      certification.featured
        ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/30 dark:ring-amber-500/30'
        : 'border-gray-200 dark:border-gray-700'
    ]"
  >
    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">
      {{ certification.title }}
    </h3>

    <p class="mt-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
      {{ certification.issuer }}
    </p>

    <p v-if="certification.date" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
      {{ certification.date }}
    </p>

    <p
      v-if="certification.credentialId"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400"
    >
      Credential ID: <span class="font-mono">{{ certification.credentialId }}</span>
    </p>

    <a
      v-if="certification.credlyUrl"
      :href="certification.credlyUrl"
      target="_blank"
      rel="noopener"
      class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
    >
      <i class="fas fa-award text-xs" />
      View on Credly
    </a>
  </div>
</template>
