<script setup lang="ts">
import { FwbP } from 'flowbite-vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    msg: string
    className?: string
    contenteditable?: boolean
  }>(),
  {
    contenteditable: false,
  },
)

const initClass = ref<string>(`${props.className} m-0`)
const emit = defineEmits<{
  (e: 'handleClick' ): void
}>()
</script>

<template>
  <fwb-p :class="initClass" :contenteditable="contenteditable" @click="emit('handleClick')">
    {{ msg }}</fwb-p>
</template>
