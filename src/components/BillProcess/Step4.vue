<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../elements/BaseButton.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import { unsubscribe } from 'diagnostics_channel';

const urlBtn = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

const copyUrl = (): void => {
  if (!urlBtn.value) return
  const urlContent = urlBtn.value.innerHTML
  console.log("html: ", urlBtn.value)
  console.log("===")
  console.log("urlContent: ", urlContent)
}

</script>

<template>
  <div class="h-full flex flex-col justify-between">
    <section class="flex flex-col gap-y-3">
      <BaseTitle className="text-center" tag="h5" msg="Final step!" />
      <BaseParagraph className="text-center"
        msg="Bill splitted! now share this link to your friends so they can see how much they owe you" />
    </section>
    <BaseButton ref="urlBtn" msg="URL Link" type="button" @handle-click="copyUrl" />
    <RouterLink :to="{name: 'home'}">
      <BaseButton msg="Back to Home" type="button" />
    </RouterLink>
  </div>
</template>
