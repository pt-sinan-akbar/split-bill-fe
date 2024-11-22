<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})
const initial = computed(() => {
  const rawInitials = props.name
    .split(' ')
    .map(n => n[0])
    .join('')
  return rawInitials.length > 2 ? rawInitials.slice(0, 2) : rawInitials
})
// jangan tanya logic ini darimana :grin:
const color = computed(() => {
  const charCode = initial.value.charCodeAt(0)
  const hex = ((charCode * 137) % 16777215).toString(16).padStart(6, '0')
  const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 180)
  const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 180)
  const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 180)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
})
</script>

<template>
  <div
    class="flex overflow-hidden relative justify-center items-center w-10 h-10 rounded-full select-none aspect-square"
    :style="`background-color: ${color}`"
  >
    <div class="font-medium text-gray-600 dark:text-gray-300">
      {{ initial }}
    </div>
  </div>
</template>

<style scoped></style>
