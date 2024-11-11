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
    outline?: boolean
    pill?: boolean
    square?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }>(),
  {
    type: 'button',
    msg: '',
    pill: false,
    square: false,
    color: 'yellow',
    outline: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  (e: 'handleClick'): void
}>()

const handleClick = () => emit('handleClick')
const className = ref<string>(
  `inline-block font-medium w-full ${props.outline ? 'text-black hover:text-white' : 'text-white hover:text-white'} ${props.className}`,
)
</script>

<template>
  <fwb-button :size="size" :class="className" :color="color" @click="handleClick" :outline="outline" :pill="pill"
    :square="square">
    <slot name="icon"></slot>
    <slot></slot>
    <!-- TODO: add ref to get the paragraph text -->
    <BaseParagraph v-if="msg" className="text-inherit font-medium" :msg="msg" />
  </fwb-button>
</template>
