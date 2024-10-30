<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Basesteps from '../elements/BaseSteps.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'

const section = ref<HTMLElement | null>(null)
const width = ref<number>(0)
const height = ref<number>(0)
const padding = ref<number>(0)

onMounted(() => {
    if (section.value) {
        width.value = section.value.clientWidth
        height.value = section.value.clientHeight
        padding.value = parseInt(getComputedStyle(section.value).paddingLeft)
    }
})
</script>

<template>
    <section
        ref="section"
        class="container mx-auto my-10 flex flex-col justify-center items-center gap-y-10"
    >
        <Basesteps />
        <Step1 :width="width" :height="height" :padding="padding" />
        <!--
        <Step2 />
-->
    </section>
</template>

<style scoped>
section {
    padding: 0 var(--PADDING_X);
}
</style>
