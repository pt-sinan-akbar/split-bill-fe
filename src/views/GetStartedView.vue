<script setup lang="ts">

import NavbarBack from '@/components/elements/NavbarBack.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import SliderModal from '@/components/elements/Modal/SliderModal.vue'
import BaseInput from '@/components/elements/BaseInput.vue'
import router from '@/router'

interface DraftBill {
  id: string
  name: string
  total: string
}

const showManualCreationModal: Ref<boolean, boolean> = ref<boolean>(false)
const toggleManualModal = () => (showManualCreationModal.value = !showManualCreationModal.value)

// this should've been saved in local storage
const draftBills = ref<DraftBill[]>([
  {
    id: '1',
    name: 'Rocky Anggrek',
    total: 'Rp30.000',
  },
  {
    id: '2',
    name: 'Cove at Batavia PIK',
    total: 'Rp500.000',
  },
])
const manualBillName = ref<string>('')

const createManualBill = () => {
  console.log('create manual bill with name: ', manualBillName.value)
  // POST request here
  router.push({ name: 'bill-creator-id', params: { id: manualBillName.value } })
}
</script>

<template>
  <NavbarBack/>
  <section
    class="flex flex-col justify-between gap-y-12 text-center w-full h-full px-8"
  >
    <div class="flex flex-col">
      <BaseTitle tag="h4" msg="How do you want" />
      <BaseTitle tag="h4" msg="to split your bill?" />
    </div>
    <div class="flex flex-col gap-y-6">
      <div class="flex flex-col justify-center gap-y-2 px-4">
        <div class="flex justify-center">
          <RouterLink :to="{ name: 'scan-bill' }">
            <BaseButton
              msg="Scan receipt"
              className="py-3 px-16 bg-primary-color rounded-3xl text-black"
              type="button"
            />
          </RouterLink>
        </div>
        <BaseParagraph className="text-sm text-gray-700" msg="Our system will process your receipt automatically
                            using cutting-edge machine learning technology,
                            after that you may add people that will join this
                            split bill and you’ll know how much each person owe
                            to you" />
      </div>
      <BaseTitle tag="h5" msg="or" />
      <div class="flex flex-col justify-center gap-y-2 px-4">
        <div class="flex justify-center">
          <BaseButton
            msg="Create bill manually"
            className="py-3 px-12 w-fit bg-primary-color rounded-3xl text-black"
            type="button"
            @handleClick="toggleManualModal"
          />
        </div>
        <BaseParagraph className="text-sm text-gray-700" msg="Using our bill creator, you can add items on your
                                                      bill, add people that will join your split bill, and
                                                      adjust all price, tax, and service, we will count
                                                      how much each person owe to you" />
      </div>
    </div>
    <div class="flex flex-col gap-y-2 mt-12">
      <BaseTitle tag="h6" msg="Continue unfinished split bill" />
      <div class="flex flex-col divide-y-2" v-if="draftBills.length > 0">
        <RouterLink :to="{ name: 'bill-creator-id', params: { id: draftBill.id } }"
                    class="flex justify-between py-4" v-for="draftBill in draftBills" :key="draftBill.id">
          <div class="flex gap-x-4">
            <BaseParagraph :msg="draftBill.name" />
            <BaseParagraph :msg="draftBill.total" />
          </div>
          <div class="pr-4">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#000000"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </RouterLink>
      </div>
      <BaseParagraph v-else msg="Nothing here yet" />
    </div>
  </section>
  <SliderModal :close-from-background="toggleManualModal" v-if="showManualCreationModal">
    <template v-slot:header>
      <BaseTitle tag="h5" msg="What will this bill called?" />
    </template>
    <template v-slot:body>
      <div class="flex gap-y-5 pb-5 items-center flex-col">
        <BaseInput
          v-model:model-value="manualBillName"
          placeholder=""
          label="Name"
          type="text"
        />
        <div class="flex flex-col text-sm">
          <BaseParagraph className="text-gray-700" msg="Tip:"/>
          <BaseParagraph className="text-gray-700" msg="Perhaps restaurant name alongside with memorable
                              memories that you made along the way?"/>
        </div>
      </div>
    </template>
    <template v-slot:fotoer>
      <BaseButton
        msg="Continue"
        type="button"
        @handleClick="createManualBill"
      />
    </template>
  </SliderModal>
</template>

<style scoped>

</style>
