<script lang="ts" setup>
import { FwbInput } from 'flowbite-vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    placeholder: string
    label: string
    type?: 'text' | 'number'
    className?: string
  }>(),
  {
    type: 'text',
  },
)

const myModel = defineModel<string | number>({
  required: true,
})

const initClass = ref<string>(`w-full ${props.className}`)
</script>

<template>
  <fwb-input
    v-model="myModel"
    required
    :placeholder="placeholder"
    :label="label"
    :type="type"
    :class="initClass"
  />
</template>
