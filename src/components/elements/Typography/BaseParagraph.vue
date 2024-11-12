<script setup lang="ts">
import { FwbP } from 'flowbite-vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    msg: string
    className?: string
    contenteditable?: boolean
    msgCopy?: string
  }>(),
  {
    contenteditable: false,
    msgCopy: 'Coppied!'
  },
)

const initClass = ref<string>(`${props.className} m-0`)
const emit = defineEmits<{
  (e: 'handleClick'): void
}>()
</script>

<template>
  <fwb-p :class="initClass" :contenteditable="contenteditable" @click="emit('handleClick')">
    {{ msg }}
    <span v-if="className?.includes('tooltip')" class="tooltiptext">
      {{ msgCopy }}
    </span>
    </fwb-p>
</template>
