<template>
  <div ref="containerRef" class="skills-chart w-full">
    <div v-if="!skills || skills.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Sin datos
    </div>
    <svg v-show="skills && skills.length > 0" ref="chartRef" class="w-full"></svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  skills: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
const containerRef = ref(null)
const { isDark } = useTheme()

let resizeObserver = null

onMounted(() => {
  renderChart()
  if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      renderChart()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(isDark, () => renderChart())
watch(() => props.skills, () => renderChart(), { deep: true })

function renderChart() {
  if (!chartRef.value || !props.skills || props.skills.length === 0) return

  const svg = d3.select(chartRef.value)
  svg.selectAll('*').remove()

  const containerWidth = containerRef.value?.clientWidth || 400
  const barHeight = 32
  const gap = 8
  const margin = { top: 10, right: 20, bottom: 10, left: 120 }
  const width = containerWidth
  const height = margin.top + margin.bottom + props.skills.length * (barHeight + gap)

  svg.attr('width', width).attr('height', height)

  const colors = {
    bar: isDark.value ? '#60a5fa' : '#3b82f6',
    barBg: isDark.value ? '#374151' : '#e5e7eb',
    text: isDark.value ? '#e5e7eb' : '#1f2937',
    subtext: isDark.value ? '#9ca3af' : '#6b7280'
  }

  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width - margin.left - margin.right])

  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const groups = chart.selectAll('.skill-bar-group')
    .data(props.skills)
    .enter()
    .append('g')
    .attr('class', 'skill-bar-group')
    .attr('transform', (d, i) => `translate(0, ${i * (barHeight + gap)})`)

  // Background bars
  groups.append('rect')
    .attr('class', 'bar-bg')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', xScale(100))
    .attr('height', barHeight)
    .attr('rx', 4)
    .attr('fill', colors.barBg)

  // Foreground bars
  groups.append('rect')
    .attr('class', 'bar-fill')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', d => xScale(d.level || 0))
    .attr('height', barHeight)
    .attr('rx', 4)
    .attr('fill', colors.bar)

  // Skill name labels (left of bars)
  svg.selectAll('.skill-label')
    .data(props.skills)
    .enter()
    .append('text')
    .attr('class', 'skill-label')
    .attr('x', margin.left - 8)
    .attr('y', (d, i) => margin.top + i * (barHeight + gap) + barHeight / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'central')
    .attr('fill', colors.text)
    .attr('font-size', '13px')
    .text(d => d.name)

  // Level percentage text inside bars
  groups.append('text')
    .attr('class', 'bar-label')
    .attr('x', d => xScale(d.level || 0) - 6)
    .attr('y', barHeight / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'central')
    .attr('fill', '#ffffff')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .text(d => `${d.level}%`)

  // Tooltips
  const tooltip = d3.select(containerRef.value)
    .selectAll('.skills-tooltip')
    .data([null])
    .join('div')
    .attr('class', 'skills-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('background', isDark.value ? '#1f2937' : '#ffffff')
    .style('color', isDark.value ? '#e5e7eb' : '#1f2937')
    .style('border', `1px solid ${isDark.value ? '#4b5563' : '#d1d5db'}`)
    .style('border-radius', '6px')
    .style('padding', '6px 10px')
    .style('font-size', '12px')
    .style('opacity', 0)
    .style('transition', 'opacity 0.15s')
    .style('z-index', '10')

  groups
    .on('mouseenter', function (event, d) {
      tooltip
        .html(`<strong>${d.name}</strong>: ${d.level}%`)
        .style('opacity', 1)
    })
    .on('mousemove', function (event) {
      const bounds = containerRef.value.getBoundingClientRect()
      tooltip
        .style('left', `${event.clientX - bounds.left + 12}px`)
        .style('top', `${event.clientY - bounds.top - 10}px`)
    })
    .on('mouseleave', function () {
      tooltip.style('opacity', 0)
    })
}
</script>

<style scoped>
.skills-chart {
  position: relative;
}
</style>
