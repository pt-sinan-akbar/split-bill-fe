<script setup lang="ts">
import { FwbP } from 'flowbite-vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    msg: string
    className?: string
    contenteditable?: boolean
    msgCopy?: string
    successCopy?: string
  }>(),
  {
    contenteditable: false,
    msgCopy: 'Copy to clipboard!',
    successCopy: 'Coppied!',
  },
)

const initClass = ref<string>(`${props.className} m-0`)
const clipboardMsg = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  (e: 'handleClick'): void
}>()

const handleClick = (): void => {
  if (props.className?.includes('tooltip')) {
    if (clipboardMsg.value) {
      clipboardMsg.value.textContent = props.successCopy
    }
  }
  emit('handleClick')
}

const resetClipboardMsg = (): void => {
  if (props.className?.includes('tooltip') && clipboardMsg.value) {
    clipboardMsg.value.textContent = props.msgCopy
  }
}
</script>

<template>
  <fwb-p :class="initClass" :contenteditable="contenteditable" @click="handleClick" @mouseleave="resetClipboardMsg">
    {{ msg }}
    <span v-if="className?.includes('tooltip')" class="tooltiptext" ref="clipboardMsg">
      {{ msgCopy }}
    </span>
  </fwb-p>
</template>
