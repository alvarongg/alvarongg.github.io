<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollSpy } from '@/composables/useScrollSpy'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

const sections = ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'hobbies', 'contact']
const { activeSection } = useScrollSpy(sections)
const { isDark } = useTheme()

const isMenuOpen = ref(false)
const showShadesTooltip = ref(false)
let tooltipTimer = null

const navItems = [
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'contact', label: 'Keep in touch' },
]

function scrollToSection(sectionId) {
  isMenuOpen.value = false
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

function dismissTooltip() {
  showShadesTooltip.value = false
}

onMounted(() => {
  if (!isDark.value) {
    tooltipTimer = setTimeout(() => {
      showShadesTooltip.value = true
    }, 3000)
  }
})

onUnmounted(() => {
  if (tooltipTimer) clearTimeout(tooltipTimer)
})

defineExpose({ isMenuOpen, scrollToSection })
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-14">
        <!-- Logo / Brand -->
        <button
          class="text-lg font-bold text-gray-800 dark:text-white cursor-pointer"
          @click="scrollToSection('hero')"
        >
          AG
        </button>

        <!-- Desktop nav links -->
        <ul class="hidden md:flex items-center space-x-1">
          <li v-for="item in navItems" :key="item.id">
            <button
              :class="[
                'relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                activeSection === item.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
              @click="scrollToSection(item.id)"
            >
              {{ item.label }}
              <!-- Active indicator bar -->
              <span
                :class="[
                  'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300',
                  activeSection === item.id
                    ? 'w-3/4 bg-blue-600 dark:bg-blue-400'
                    : 'w-0 bg-transparent'
                ]"
              />
            </button>
          </li>
          <li class="relative">
            <ThemeToggle @click="dismissTooltip" />
            <!-- Shades tooltip (desktop) -->
            <Transition name="tooltip-fade">
              <div
                v-if="showShadesTooltip && !isDark"
                class="shades-tooltip absolute top-full right-0 mt-2 whitespace-nowrap pointer-events-none"
              >
                <!-- Arrow pointing up -->
                <div class="flex justify-end pr-4">
                  <svg class="w-4 h-4 text-gray-800 dark:text-gray-200 animate-bounce-subtle" viewBox="0 0 16 8" fill="currentColor">
                    <polygon points="8,0 16,8 0,8" />
                  </svg>
                </div>
                <div class="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                  <span>😎</span>
                  <span>Put your shades on</span>
                </div>
              </div>
            </Transition>
          </li>
        </ul>

        <!-- Mobile: theme toggle + hamburger -->
        <div class="flex items-center space-x-2 md:hidden">
          <div class="relative">
            <ThemeToggle @click="dismissTooltip" />
            <!-- Shades tooltip (mobile) -->
            <Transition name="tooltip-fade">
              <div
                v-if="showShadesTooltip && !isDark"
                class="shades-tooltip absolute top-full right-0 mt-2 whitespace-nowrap pointer-events-none z-50"
              >
                <div class="flex justify-end pr-3">
                  <svg class="w-4 h-4 text-gray-800 dark:text-gray-200 animate-bounce-subtle" viewBox="0 0 16 8" fill="currentColor">
                    <polygon points="8,0 16,8 0,8" />
                  </svg>
                </div>
                <div class="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                  <span>😎</span>
                  <span>Put your shades on</span>
                </div>
              </div>
            </Transition>
          </div>
          <button
            :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
            aria-expanded="false"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700">
        <ul class="px-4 py-2 space-y-1">
          <li v-for="item in navItems" :key="item.id">
            <button
              :class="[
                'relative block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                activeSection === item.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold border-l-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border-l-2 border-transparent'
              ]"
              @click="scrollToSection(item.id)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: max-height 0.3s ease, opacity 0.2s ease;
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* Tooltip fade animation */
.tooltip-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.tooltip-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.tooltip-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Shades tooltip auto-dismiss */
.shades-tooltip {
  animation: tooltip-lifecycle 5s ease forwards;
}

@keyframes tooltip-lifecycle {
  0% { opacity: 0; transform: translateY(-8px); }
  10% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
}

/* Subtle bounce for the arrow */
.animate-bounce-subtle {
  animation: bounce-subtle 1.5s ease-in-out infinite;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>
