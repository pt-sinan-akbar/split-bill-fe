<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Basesteps from '../elements/BaseSteps.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'

const section = ref<HTMLElement | null>(null)
const width = ref<number>(100)
const height = ref<number>(100)
const padding = ref<number>(0)
const currStep = ref<number>(1)

onMounted(() => {
  if (section.value) {
    padding.value = parseInt(getComputedStyle(section.value).paddingLeft)
  }
})

const increaseStep = (): number => currStep.value++
const decreseStep = (): number => currStep.value--
</script>

<template>
  <section ref="section" class="mx-auto my-10 flex flex-col justify-start items-center gap-y-10 w-full h-screen">
    <Basesteps />
    <Step1 v-if="currStep === 1" :width="width" :height="height" :padding="padding" @next-step="increaseStep" />
    <Step2 v-if="currStep === 2" @prev-step="decreseStep" @next-step="increaseStep" />
  </section>
</template>

<style scoped>
section {
  padding: 0 var(--PADDING_X);
}
</style>
