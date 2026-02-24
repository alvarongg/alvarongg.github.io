<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
    validator: (v) => v.title && v.description && v.type && Array.isArray(v.links),
  },
})

const typeLabels = {
  project: 'Project',
  talk: 'Talk',
  event: 'Event',
  application: 'Application',
}

const typeColors = {
  project: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  talk: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  event: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  application: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
}

const techIconMap = {
  aws: 'devicon-amazonwebservices-original',
  python: 'devicon-python-plain',
  javascript: 'devicon-javascript-plain',
  typescript: 'devicon-typescript-plain',
  vue: 'devicon-vuejs-plain',
  react: 'devicon-react-original',
  docker: 'devicon-docker-plain',
  terraform: 'devicon-terraform-plain',
  nodejs: 'devicon-nodejs-plain',
  java: 'devicon-java-plain',
  go: 'devicon-go-plain',
}
</script>

<template>
  <div
    :class="[
      'rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105',
      project.featured
        ? 'border-2 border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/30 dark:ring-amber-500/30'
        : 'border border-gray-200 dark:border-gray-700'
    ]"
  >
    <!-- Image -->
    <div v-if="project.image" class="w-full h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        :src="project.image"
        :alt="project.title"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-5">
      <!-- Type badge -->
      <span
        class="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2"
        :class="typeColors[project.type] || typeColors.project"
      >
        {{ typeLabels[project.type] || project.type }}
      </span>

      <!-- Title -->
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug">
        {{ project.title }}
      </h3>

      <!-- Description -->
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
        {{ project.description }}
      </p>

      <!-- Highlights -->
      <div v-if="project.highlights && project.highlights.length" class="mt-3 space-y-2">
        <div
          v-for="hl in project.highlights"
          :key="hl.label"
          class="flex items-start gap-2"
        >
          <i :class="hl.icon" class="text-blue-500 dark:text-blue-400 mt-0.5 text-xs flex-shrink-0" />
          <p class="text-xs text-gray-600 dark:text-gray-300">
            <span class="font-semibold">{{ hl.label }}:</span> {{ hl.detail }}
          </p>
        </div>
      </div>

      <!-- Technologies -->
      <div
        v-if="project.technologies && project.technologies.length"
        class="mt-3 flex flex-wrap gap-2"
      >
        <span
          v-for="tech in project.technologies"
          :key="tech"
          class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <i
            v-if="techIconMap[tech]"
            :class="techIconMap[tech]"
            class="text-sm"
          />
          {{ tech }}
        </span>
      </div>

      <!-- Links -->
      <div
        v-if="project.links && project.links.length"
        class="mt-4 flex flex-wrap gap-3"
      >
        <a
          v-for="link in project.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          <i v-if="link.icon" :class="link.icon" class="text-xs" />
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>
