<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import UrlButton from '../elements/Button/Variants/UrlButton.vue'
import { FwbImg } from 'flowbite-vue'

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

const urlMsg = ref<string>('Default Url Link')

const copyUrl = (): void => {
  if (!urlMsg.value) return
  navigator.clipboard
    .writeText(urlMsg.value)
    .then(() => {
      console.log('Text copied to clipboard!')
    })
    .catch(err => {
      console.error('Failed to copy text: ', err)
    })
}
</script>

<template>
  <div class="h-screen flex flex-col justify-between">
    <section class="flex flex-col gap-y-3">
      <BaseTitle className="text-center" tag="h5" msg="Final step!" />
      <BaseParagraph className="text-center"
        msg="Bill splitted! now share this link to your friends so they can see how much they owe you" />
    </section>
    <UrlButton :msg="urlMsg" @handle-click="copyUrl" />
    <div class="flex flex-col gap-y-10">
      <RouterLink :to="{ name: 'home' }">
        <BaseButton msg="Back to Home" type="button" />
      </RouterLink>
      <fwb-img alt="logo" src="/foto-bersama.png" />
    </div>
  </div>
</template>
