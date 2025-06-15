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
  billOwner.value = { ...bill.value.bill_owner }
}
const internalProgress = inject('internalProgress') as Ref<InternalProgress>
const errMsg = ref<string | null>(null)

const validateInput = (): boolean => {
  if (billOwner.value.name === ''){
    errMsg.value = 'Name is required'
    return false
  }
  errMsg.value = null
  return true
}

const isNoChanges = (): boolean => {
  if (!bill.value.bill_owner) {
    return false
  }
  return (
    bill.value.bill_owner &&
    bill.value.bill_owner.name === billOwner.value.name &&
    bill.value.bill_owner.contact === billOwner.value.contact &&
    bill.value.bill_owner.bank_account === billOwner.value.bank_account
  )
}

const handleSubmit = async (): Promise<void> => {
  if (validateInput()) {
    if (!isNoChanges()){
      bill.value.bill_owner = await upsertContact()
    }
    // TODO: one more request to finalize all data (priceOwe member)
    internalProgress.value = InternalProgress.SHARE
  }
}

const handleBack = async (): Promise<void> => {
  if (validateInput()) {
    if (!isNoChanges()){
      bill.value.bill_owner = await upsertContact()
    }
    internalProgress.value = InternalProgress.CREATOR
  }
}

const upsertContact = async (): Promise<BillOwner> => {
  const data : BillOwner = {
    name: billOwner.value.name,
    contact: billOwner.value.contact,
    bank_account: billOwner.value.bank_account,
  }
  if (bill.value.bill_owner){
    data.id = bill.value.bill_owner.id
  }
  try {
    const response = await axios.post(
      `/api/v1/bills/${bill.value.id}/dynamic/owner`, data
    )
    return response.data as BillOwner
  } catch (error) {
    console.error('Error saving contact:', error)
    errMsg.value = 'Failed to save contact, please try again later'
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
      <BaseParagraph
        v-if="errMsg"
        class="text-red-500"
        :msg="errMsg"
      />
    </div>
  </form>
  <div class="w-full flex gap-x-3 mt-auto">
    <PrevButton @handleClick="handleBack" />
    <BaseButton msg="Continue" type="submit" @handleClick="handleSubmit" />
  </div>
</template>
