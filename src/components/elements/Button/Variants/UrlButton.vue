<script setup lang="ts">
import BaseButton from '../../BaseButton.vue'

const props = defineProps<{
  msg?: string
}>()

const emit = defineEmits<{
  (e: 'handleClick'): void
}>()
</script>

<template>
  <BaseButton
    :msg="msg"
    type="button"
    @handle-click="emit('handleClick')"
    className="tooltip"
    msg-copy="Copy link"
    success-copy="Link Copped!"
  >
    <template v-slot:icon>
      <svg
        class="w-6 h-6 text-gray-800 text-white dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
        />
      </svg>
    </template>
  </BaseButton>
</template>
