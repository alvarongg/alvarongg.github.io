<script setup>
import { useTheme } from '@/composables/useTheme'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import EducationSection from '@/components/sections/EducationSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import HobbiesSection from '@/components/sections/HobbiesSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const { init } = useTheme()
init()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <AppNavbar />
    <main class="pt-14">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <HobbiesSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>
