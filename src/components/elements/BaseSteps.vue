<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    totalSteps: number
    activeStep: number
  }>(),
  {
    activeStep: 1,
  },
)

const isActiveStep = (index: number): boolean => props.activeStep === index
const isDoneStep = (index: number): boolean => props.activeStep > index
const isLastStep = (index: number): boolean => props.totalSteps === index

const handleClassSteps = (index: number): string => {
  let className: string = ''
  if ((isLastStep(index) && isActiveStep(index)) || isLastStep(index)) {
    className = 'flex items-center'
  } else if (isActiveStep(index) || isDoneStep(index)) {
    className =
      "flex w-full items-center text-yellow-500 dark:text-yellow-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-yellow-300 after:border-4 after:inline-block dark:after:border-blue-800"
  } else {
    className =
      "flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700"
  }
  console.log('class', className)
  return className
}
</script>

<template>
  <ol class="flex items-center w-full">
    <li v-for="(step, index) in totalSteps" :key="index" :class="[handleClassSteps(index + 1)]">
      <span :class="[
        isActiveStep(index + 1) || isDoneStep(index + 1)
          ? `flex items-center justify-center w-10 h-10 bg-primary-background rounded-full lg:h-12 lg:w-12 dark:bg-primary-background shrink-0`
          : `flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0`,
      ]">
        <template v-if="isActiveStep(index + 1) || isDoneStep(index + 1)">
          <svg class="w-3.5 h-3.5 text-light-text-color lg:w-4 lg:h-4 dark:text-yellow-300" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 5.917 5.724 10.5 15 1.5" />
          </svg>
        </template>
        <template v-else>
          <span class="rounded-full w-6 h-6 bg-primary-background"></span>
        </template>
      </span>
    </li>
  </ol>
</template>
