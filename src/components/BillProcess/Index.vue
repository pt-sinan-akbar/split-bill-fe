<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Basesteps from '../elements/BaseSteps.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
import Step4 from './Step4.vue'
import { computed } from 'vue'
import Navbar from '../elements/Navbar.vue'

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
const resetStep = (): number => (currStep.value = 1)
</script>

<template>
  <Navbar />
  <section ref="section" class="mx-auto my-5 flex flex-col justify-start items-center gap-y-10 w-full">
    <Basesteps :total-steps="4" :active-step="currStep" />
    <Step1 v-if="currStep === 1" :width="width" :height="height" :padding="padding" @next-step="increaseStep" />
    <Step2 v-if="currStep === 2" @prev-step="decreseStep" @next-step="increaseStep" />
    <Step3 v-if="currStep === 3" @prev-step="decreseStep" @next-step="increaseStep" />
    <Step4 v-if="currStep === 4" @prev-step="resetStep" @next-step="increaseStep" />
  </section>
</template>

<style scoped>
section {
  padding: 0 var(--PADDING_X);
  min-height: 100vh;
}
</style>
