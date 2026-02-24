<script setup>
import personal from '@/data/personal.js'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'

const { copied: emailCopied, copy: copyEmail } = useCopyToClipboard()
const { copied: phoneCopied, copy: copyPhone } = useCopyToClipboard()
</script>

<template>
  <SectionWrapper id="contact" title="Keep in touch">
    <div class="max-w-3xl mx-auto text-center space-y-10">
      <!-- Email & Phone as clickable copy buttons -->
      <div class="space-y-4">
        <!-- Email -->
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            @click="copyEmail(personal.email)"
          >
            <i class="fas fa-at" />
            <span>{{ personal.email }}</span>
          </button>
          <Transition name="fade-slide">
            <span
              v-if="emailCopied"
              class="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"
            >
              <i class="fas fa-check" />
              Email copied
            </span>
          </Transition>
        </div>

        <!-- Phone -->
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            @click="copyPhone(personal.phone)"
          >
            <i class="fas fa-phone" />
            <span>{{ personal.phone }}</span>
          </button>
          <Transition name="fade-slide">
            <span
              v-if="phoneCopied"
              class="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"
            >
              <i class="fas fa-check" />
              Phone copied
            </span>
          </Transition>
        </div>
      </div>

      <!-- Social icons with labels -->
      <div class="flex flex-wrap justify-center gap-8">
        <a
          v-for="link in personal.socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="flex flex-col items-center gap-2 group"
        >
          <span
            class="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 group-hover:text-white group-hover:bg-blue-600 dark:group-hover:bg-blue-500 hover:shadow-lg hover:scale-110 transition-all duration-300"
          >
            <i :class="link.icon" />
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">
            {{ link.name }}
          </span>
        </a>
      </div>
    </div>
  </SectionWrapper>
</template>

<style scoped>
.fade-slide-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>
