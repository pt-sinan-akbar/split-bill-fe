<script setup lang="ts">
import {
  FwbAccordion,
  FwbAccordionContent,
  FwbAccordionHeader,
  FwbAccordionPanel,
} from 'flowbite-vue'
</script>

<template>
  <fwb-accordion class="w-full p-0">
    <fwb-accordion-panel class="p-0">
      <fwb-accordion-header class="header-accordion">
        <slot name="title"></slot>
      </fwb-accordion-header>
      <fwb-accordion-content>
        <slot name="body"></slot>
      </fwb-accordion-content>
    </fwb-accordion-panel>
  </fwb-accordion>
</template>

<style>
.header-accordion button {
  padding: 16px !important;
  background-color: white;
}
</style>
