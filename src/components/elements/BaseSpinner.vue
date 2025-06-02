<script setup lang="ts">
import { FwbSpinner } from 'flowbite-vue'
import type { SpinnerColor, SpinnerSize } from 'flowbite-vue/components/FwbSpinner/types.d.ts'
const props = withDefaults(
  defineProps<{
    className?: string
    size?: SpinnerSize
    color?: SpinnerColor
  }>(),
  {
    className: '',
    size: '8',
    color: 'yellow',
  },
)
</script>

<template>
  <fwb-spinner :size="size" :color="color" :class="className" />
</template>
