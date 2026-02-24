<script setup>
import personal from '@/data/personal.js'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        &copy; {{ currentYear }} {{ personal.fullName }}. All rights reserved.
      </p>
    </div>
  </footer>
</template>
