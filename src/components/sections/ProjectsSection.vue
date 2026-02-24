<script setup>
import projects from '@/data/projects.js'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
</script>

<template>
  <SectionWrapper id="projects" title="Projects & Events">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </div>
  </SectionWrapper>
</template>
