<script setup lang="ts">
import BaseButton from '../../BaseButton.vue';
const emit = defineEmits<{
  (e: 'handleClick'): void
}>()
</script>

<template>
  <BaseButton :pill="true" :square="true" :outline="true" className="w-fit" type="button" @handle-click="emit('handleClick')">
    <template v-slot:icon>
      <svg class="w-5 h-5 mx-2 text-yellow-500 text-inherit hover:text-inherit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 16.881V7.119a1 1 0 0 0-1.636-.772l-5.927 4.881a1 1 0 0 0 0 1.544l5.927 4.88a1 1 0 0 0 1.636-.77Z" />
      </svg>
    </template>
  </BaseButton>
</template>
