<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import Basesteps from '../elements/BaseSteps.vue'
import Navbar from '../elements/Navbar.vue'

const section = ref<HTMLElement | null>(null)
const padding = ref<number>(0)
const currStep = ref<number>(1)
const maxStep = ref<number>(4)

provide('currStep', currStep)
provide('maxStep', maxStep)

onMounted(() => {
  if (section.value) {
    padding.value = parseInt(getComputedStyle(section.value).paddingLeft)
  }
})

</script>

<template>
  <Navbar />
  <section
    ref="section"
    class="mx-auto my-5 flex flex-col justify-start items-center gap-y-10 w-full"
  >
    <Basesteps :total-steps="maxStep" :active-step="currStep" />
    <router-view />
  </section>
</template>

<style scoped>
section {
  padding: 0 var(--PADDING_X);
  height: 100%;
  flex-grow: 1;
}
</style>
