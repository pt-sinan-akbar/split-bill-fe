<script setup lang="ts">
import { ref } from 'vue'
import BaseParagraph from './BaseParagraph.vue'

const props = defineProps<{
  price: number
  className?: string
}>()
const className = ref<string>(props.className || '')
const msg = ref<string>(`Rp ${props.price.toLocaleString()}`)
</script>

<template>
  <BaseParagraph :msg="msg" :className="className" />
</template>
