<script setup lang="ts">
import { inject, type Ref, ref } from 'vue'
import BaseInput from '@/components/elements/BaseInput.vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import PrevButton from '@/components/elements/Button/Variants/PrevButton.vue'
import type { Bill, BillOwner } from '@/types/Bill'
import { InternalProgress } from '@/types/BillCreatorInternalProgress'

const props = defineProps<{
  bill: Bill
}>()

const billOwner = ref<BillOwner>({
  name: '',
  contact: '',
  bank_account: '',
})
if (props.bill.bill_owner !== null) {
  billOwner.value = props.bill.bill_owner
}
const internalProgress = inject('internalProgress') as Ref<InternalProgress>

const handleSubmit = (): void => {
  // TODO: validate data input
  console.log('submitted data: ', billOwner.value)
  props.bill.bill_owner = billOwner.value
  internalProgress.value = InternalProgress.SHARE
}

const handleBack = (): void => {
  console.log('return to creator: ', billOwner.value)
  // save as draft
  props.bill.bill_owner = billOwner.value
  internalProgress.value = InternalProgress.CREATOR
}

</script>

<template>
  <form
    class="flex flex-col gap-y-5"
  >
    <div class="flex flex-col gap-y-10">
      <section class="flex flex-col gap-y-3">
        <BaseTitle className="text-center" tag="h5" msg="Insert Your Details" />
        <BaseParagraph
          className="text-center"
          msg="To let your friends knows where to pay"
        />
      </section>
      <div class="flex flex-col gap-y-10">
        <BaseInput
          v-model:model-value="billOwner.name"
          placeholder="Name"
          label="Name"
          type="text"
        />
        <BaseInput
          v-model:model-value="billOwner.contact"
          placeholder="Contact"
          label="Contact"
          type="text"
        />
        <BaseInput
          v-model:model-value="billOwner.bank_account"
          placeholder="Pay to"
          label="Pay To"
          type="text"
        />
      </div>
    </div>
  </form>
  <div class="w-full flex gap-x-3 mt-auto">
    <PrevButton @handleClick="handleBack" />
    <BaseButton msg="Continue" type="submit" @handleClick="handleSubmit" />
  </div>
</template>
