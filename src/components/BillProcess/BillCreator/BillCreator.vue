<script setup lang="ts">

import { inject, provide, type Ref, ref, watch } from 'vue'
import type { Bill } from '@/types/Bill'
import { InternalProgress } from '@/types/BillCreatorInternalProgress'
import Creator from '@/components/BillProcess/BillCreator/Creator.vue'
import Contact from '@/components/BillProcess/BillCreator/Contact.vue'
import Share from '@/components/BillProcess/BillCreator/Share.vue'

const mockData = ref<Bill>({
  id: '1',
  name: 'Cove at Batavia PIK (where Abdul drinks)',
  raw_image: null,
  data: {
    id: 1,
    store_name: 'Cove at Batavia PIK',
    discount: 0,
    misc: '',
    service: 21000,
    tax: 42000,
    sub_total: 420000,
    total: 483000
  },
  items: [
    {
      id: 1,
      name: 'Bintang Radler',
      discount: 0,
      price: 50000,
      qty: 1,
      tax: 5000,
      service: 2500,
      subtotal: 50000
    },
    {
      id: 2,
      name: 'Shrimp Platter (with Pork Oil)',
      discount: 0,
      price: 100000,
      qty: 1,
      tax: 10000,
      service: 5000,
      subtotal: 100000
    },
    {
      id: 3,
      name: 'Gyukaku',
      discount: 0,
      price: 270000,
      qty: 1,
      tax: 27000,
      service: 13500,
      subtotal: 270000
    }
  ],
  members: [
    {
      id: 1,
      name: 'Abdul'
    },
    {
      id: 2,
      name: 'Zakwir'
    },
    {
      id: 3,
      name: 'Mus Musculus'
    }
  ],
  items_members: [
    {
      id: 1,
      item_id: 1,
      member_id: 1,
      qty: 1
    },
    {
      id: 1,
      item_id: 2,
      member_id: 2,
      qty: 1
    },
    {
      id: 1,
      item_id: 3,
      member_id: 3,
      qty: 1
    }
  ],
  owner: null
})

const internalProgress = ref<InternalProgress>(InternalProgress.CREATOR)
provide('internalProgress', internalProgress)

const currStep = inject('currStep') as Ref<number>
const maxStep = inject('maxStep') as Ref<number>

// put this on fetch, also add currStep
if (mockData.value.raw_image) {
  currStep.value = 2
  maxStep.value = 4
} else {
  currStep.value = 1
  maxStep.value = 3
}

watch(internalProgress, (newVal) => {
  if (newVal === InternalProgress.CREATOR) {
    currStep.value = maxStep.value === 4 ? 2 : 1
  } else if (newVal === InternalProgress.CONTACT) {
    currStep.value = maxStep.value === 4 ? 3 : 2
  } else if (newVal === InternalProgress.SHARE) {
    currStep.value = maxStep.value === 4 ? 4 : 3
  }
})

</script>

<template>
  <Creator :bill="mockData" v-if="internalProgress === InternalProgress.CREATOR" />
  <Contact :bill="mockData" v-if="internalProgress === InternalProgress.CONTACT" />
  <Share :bill="mockData" v-if="internalProgress === InternalProgress.SHARE" />
</template>

<style scoped>

</style>
