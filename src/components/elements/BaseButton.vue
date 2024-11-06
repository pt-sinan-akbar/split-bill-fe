<script setup lang="ts">
import BaseParagraph from './Typography/BaseParagraph.vue'
import { FwbButton } from 'flowbite-vue'
import { ButtonVariant } from 'flowbite-vue/dist/components/FwbButton/types'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    msg?: string
    type?: 'button' | 'submit'
    color?: ButtonVariant
    className?: string
  }>(),
  {
    type: 'button',
    msg: '',
    color: 'yellow',
  },
)

const emit = defineEmits<{
  (e: 'handleClick'): void
}>()

const handleClick = () => emit('handleClick')

const className = ref<string>(`${props.className} inline-block font-medium`)
</script>

<template>
  <fwb-button :class="className" :color="color" size="lg" @click="handleClick">
    <template #prefix>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
    <BaseParagraph className="text-white" :msg="msg" />
  </fwb-button>
</template>
