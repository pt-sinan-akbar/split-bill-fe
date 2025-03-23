<script setup lang="ts">

import NavbarBack from '@/components/elements/NavbarBack.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import { ref } from 'vue'

interface DraftBill {
  id: string
  name: string
  total: string
}

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
          <RouterLink :to="{ name: 'add-split-bill' }">
            <BaseButton
              msg="Scan receipt"
              className="py-3 px-16 bg-primary-color rounded-3xl text-black"
              type="button"
            />
          </RouterLink>
        </div>
        <BaseParagraph className="text-gray-700" msg="Our system will process your receipt automatically
                            using cutting-edge machine learning technology,
                            after that you may add people that will join this
                            split bill and you’ll know how much each person owe
                            to you" />
      </div>
      <BaseTitle tag="h4" msg="or" />
      <div class="flex flex-col justify-center gap-y-2 px-4">
        <div class="flex justify-center">
          <RouterLink :to="{ name: 'add-split-bill' }">
            <BaseButton
              msg="Create bill manually"
              className="py-3 px-16 bg-primary-color rounded-3xl text-black"
              type="button"
            />
          </RouterLink>
        </div>
        <BaseParagraph className="text-gray-700" msg="Using our bill creator, you can add items on your
                                                      bill, add people that will join your split bill, and
                                                      adjust all price, tax, and service, we will count
                                                      how much each person owe to you" />
      </div>
    </div>
    <div class="flex flex-col gap-y-2 mt-12">
      <BaseTitle tag="h6" msg="Continue unfinished split bill" />
      <div class="flex flex-col divide-y-2">
        <RouterLink to="/bill-creator/abc" class="flex justify-between py-4" v-for="draftBill in draftBills" :key="draftBill.id">
          <div class="flex gap-x-4">
            <BaseParagraph :msg="draftBill.name" />
            <BaseParagraph :msg="draftBill.total" />
          </div>
          <div class="pr-4">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
