<script setup lang="ts">
import {  watch } from 'vue'
import { FwbModal } from 'flowbite-vue'

const props = withDefaults(
    defineProps<{
        isShowModal: boolean
    }>(),
    {
        isShowModal: false,
    },
)

const emit = defineEmits<{
  (e: 'update:isShowModal', value: boolean) : boolean
}>()

watch(
    () => props.isShowModal,
    newVal => {
        emit('update:isShowModal', newVal)
    },
)

const closeModal = (): boolean => emit('update:isShowModal', false)
</script>

<template>
    <fwb-modal v-if="isShowModal" @close="closeModal">
        <template #header>
            <slot name="header"></slot>
        </template>
        <template #body>
            <slot name="body"></slot>
        </template>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </fwb-modal>
</template>
