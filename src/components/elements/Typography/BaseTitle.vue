<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import { ref } from 'vue'

const props = defineProps<{
  tag: string
  className?: string
  msg: string
}>()
</script>

<template>
  <fwb-heading :class="className" :tag="tag"> {{ msg }} </fwb-heading>
</template>
