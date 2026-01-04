<script setup lang="ts">
import router from '@/router'
import { computed, inject, type Ref } from 'vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import UrlButton from '@/components/elements/Button/Variants/UrlButton.vue'
import { FwbImg } from 'flowbite-vue'
import type { Bill } from '@/types/Bill'

const bill = inject('bill') as Ref<Bill>

const urlMsg = computed<string>((): string => {
  const id = router.currentRoute.value.params.id
  if (!id) return ''
  return `${window.location.origin}/s/${id}`
})

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
      <BaseParagraph
        className="text-center"
        msg="Bill splitted! now share this link to your friends so they can see how much they owe you"
      />
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
