<script setup lang="ts">
import { FwbListGroup, FwbListGroupItem } from 'flowbite-vue'
const props = defineProps<{
  items: Array<string>
}>()
</script>

<template>
  <fwb-list-group>
    <fwb-list-group-item v-for="(item, index) in items" :key="index"
      >{{ item }}
    </fwb-list-group-item>
  </fwb-list-group>
</template>
