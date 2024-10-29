<script setup lang="ts">
import Basesteps from '../elements/BaseSteps.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
</script>

<template>
    <section
        class="container mx-auto px-10 my-10 flex flex-col justify-center items-center gap-y-10"
    >
        <Basesteps />
        <!--
  <Step1 />
-->
        <Step2 />
    </section>
</template>
