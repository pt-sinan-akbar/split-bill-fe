<script setup lang="ts">
import BaseParagraph from './Typography/BaseParagraph.vue'
import { FwbButton } from 'flowbite-vue'
import type { ButtonVariant } from 'flowbite-vue/components/FwbButton/types.js'
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
    msgCopy?: string
    successCopy?: string
    isDisabled?: boolean
  }>(),
  {
    type: 'button',
    msg: '',
    pill: false,
    square: false,
    color: 'yellow',
    outline: false,
    size: 'md',
    isDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'handleClick'): void
  (e: 'handleClick'): void
  (e: 'refContent', el: HTMLElement | null): void
}>()

const handleClick = () => emit('handleClick')
const initBtnClass = ref<string>(
  `inline-block font-medium w-full ${props.outline ? 'text-black hover:text-white' : 'text-white hover:text-white'} ${props.className}`,
)
const initBtnContentClass = ref<string>(
  `text-inherit font-medium ${props.className?.includes('tooltip') ? 'tooltip' : ''}`,
)
</script>

<template>
  <fwb-button
    :size="size"
    :class="initBtnClass"
    :color="color"
    @click.stop="handleClick"
    :outline="outline"
    :pill="pill"
    :square="square"
    :disabled="isDisabled"
  >
    <div v-if="$slots.icon" class="flex gap-x-3 justify-start items-center">
      <slot name="icon"></slot>
      <slot></slot>
      <BaseParagraph
        v-if="msg"
        :className="initBtnContentClass"
        :msg="msg"
        :msg-copy="msgCopy"
        :success-copy="successCopy"
      />
    </div>
    <div v-else>
      <slot></slot>
      <BaseParagraph
        v-if="msg"
        :className="initBtnContentClass"
        :msg="msg"
        :msg-copy="msgCopy"
      />
    </div>
  </fwb-button>
</template>

<style>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 140px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  margin-bottom: 16px;
  opacity: 1;
}
</style>
