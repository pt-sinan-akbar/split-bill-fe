<script setup lang="ts">
import { ref, watch } from 'vue'
import { FwbButton, FwbModal } from 'flowbite-vue'

const props = withDefaults(
    defineProps<{
        isShowModal: boolean
    }>(),
    {
        isShowModal: false,
    },
)

const emit = defineEmits<{
    'update:isShowModal': (value: boolean) => void
}>()

watch(
    () => props.isShowModal,
    newVal => {
        emit('update:isShowModal', newVal)
    },
)

const closeModal = (): void => emit('update:isShowModal', false)
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
