<script setup lang="ts">
import { FwbP } from 'flowbite-vue'
import { ref } from 'vue'

const props = defineProps<{
  msg: string
  className?: string
}>()

const initClass = ref<string>(`${props.className} m-0`)
</script>

<template>
  <fwb-p :class="initClass"> {{ msg }}</fwb-p>
</template>
