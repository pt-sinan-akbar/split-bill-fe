<script setup lang="ts">
import BaseParagraph from './Typography/BaseParagraph.vue'
import { FwbButton } from 'flowbite-vue'
import { ref, onMounted } from 'vue'

const props = withDefaults(
    defineProps<{
        msg: string
        type: 'button' | 'submit'
        color?: string
        className?: string
        onClick?: () => void
    }>(),
    {
        color: 'yellow',
    },
)

const className = ref<string>(`${props.className} font-medium`)
</script>

<template>
    <fwb-button :class="className" :color="color" size="lg">
        <template #prefix>
            <slot name="icon"></slot>
        </template>
        <BaseParagraph className="text-white" :msg="msg" />
    </fwb-button>
</template>
