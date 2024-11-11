<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../elements/BaseInput.vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'

interface FormData {
  name: string
  contact: number
  paymentInfo: string
}

const billOwnerData = ref<FormData>({
  name: '',
  contact: 0,
  paymentInfo: '',
})

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

const handleSubmit = (): void => {
  // TODO: validate data input
  console.log('submitted data: ', billOwnerData.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="h-full flex flex-col justify-between">
    <section class="flex flex-col gap-y-3">
      <BaseTitle className="text-center" tag="h5" msg="Insert Your Details" />
      <BaseParagraph className="text-center" msg="To let your friends knows where to pay" />
    </section>
    <div class="flex flex-col gap-y-10">
      <BaseInput v-model:model-value="billOwnerData.name" placeholder="Name" label="Name" type="text" />
      <BaseInput v-model:model-value="billOwnerData.contact" placeholder="Contact" label="Contact" type="number" />
      <BaseInput v-model:model-value="billOwnerData.paymentInfo" placeholder="Pay to" label="Pay To" type="text" />
    </div>
    <BaseButton msg="Continue" type="submit" />
  </form>
</template>
