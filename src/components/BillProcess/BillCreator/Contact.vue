<script setup lang="ts">
import { inject, type Ref, ref } from 'vue'
import BaseInput from '@/components/elements/BaseInput.vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import PrevButton from '@/components/elements/Button/Variants/PrevButton.vue'
import type { Bill, BillOwner } from '@/types/Bill'
import { InternalProgress } from '@/types/BillCreatorInternalProgress'
import axios from 'axios'

const bill = inject('bill') as Ref<Bill>
const billOwner = ref<BillOwner>({
  name: '',
  contact: '',
  bank_account: '',
})
if (bill.value.bill_owner !== null) {
  billOwner.value = bill.value.bill_owner
}
const internalProgress = inject('internalProgress') as Ref<InternalProgress>

const handleSubmit = async (): Promise<void> => {
  // TODO: validate data input
  bill.value.bill_owner = await upsertContact()
  // TODO: one more request to finalize all data (priceOwe member)
  internalProgress.value = InternalProgress.SHARE
}

const handleBack = async (): Promise<void> => {
  // TODO: validate data input
  bill.value.bill_owner = await upsertContact()
  internalProgress.value = InternalProgress.CREATOR
}

const upsertContact = async (): Promise<BillOwner> => {
  const data : BillOwner = {
    name: billOwner.value.name,
    contact: billOwner.value.contact,
    bank_account: billOwner.value.bank_account,
  }
  if (bill.value.bill_owner?.id) {
    data.id = bill.value.bill_owner.id
  }
  try {
    const response = await axios.post(
      `/api/v1/bills/${bill.value.id}/dynamic/owner`, data
    )
    if (response.status !== 200) {
      throw new Error('Error saving contact')
    }
    return response.data as BillOwner
  } catch (error) {
    console.error('Error saving contact:', error)
    throw new Error('Failed to save contact')
  }
}
</script>

<template>
  <form class="flex flex-col gap-y-5">
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
