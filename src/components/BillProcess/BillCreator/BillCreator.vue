<script setup lang="ts">

import { inject, provide, type Ref, ref, watch } from 'vue'
import type { Bill } from '@/types/Bill'
import { InternalProgress } from '@/types/BillCreatorInternalProgress'
import Creator from '@/components/BillProcess/BillCreator/Creator.vue'
import Contact from '@/components/BillProcess/BillCreator/Contact.vue'
import Share from '@/components/BillProcess/BillCreator/Share.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useHead } from '@unhead/vue'

const route = useRoute();
const billId = route.params.id as string;

const loading = ref<boolean>(true)
const data = ref<Bill | null>(null)
const error = ref<string | null>(null)

// TODO: move this to a separate file for API calls
const useBill = async (id: string): Promise<Bill> => {
  try {
    const response = await axios.get(`/api/v1/bills/${id}`)
    if(response.status !== 200){
      throw new Error('Error')
    }
    return response.data as Bill
  } catch (error) {
    console.error('Error fetching bill:', error)
    throw new Error('Failed to fetch bill data')
  }
}

async function fetchData(id: string) {
  try {
    loading.value = true
    data.value = await useBill(id)
    error.value = null
    const ocrBill = data.value.raw_image !== null
    const unfinishedBill = data.value.bill_member.every(member => member.price_owe === null)
    maxStep.value = ocrBill ? 4 : 3;
    currStep.value = unfinishedBill ? (ocrBill ? 2 : 1) : (ocrBill ? 4 : 3)
    internalProgress.value = unfinishedBill ? InternalProgress.CREATOR : InternalProgress.SHARE;
  } catch (err) {
    console.error('Error fetching bill:', err)
    error.value = 'Failed to fetch bill data'
  } finally {
    loading.value = false
  }
}

watch(() => billId, fetchData, { immediate: true })

const internalProgress = ref<InternalProgress>(InternalProgress.CREATOR)
provide('internalProgress', internalProgress)
provide('bill', data)

const currStep = inject('currStep') as Ref<number>
const maxStep = inject('maxStep') as Ref<number>

watch(internalProgress, (newVal) => {
  if (newVal === InternalProgress.CREATOR) {
    currStep.value = maxStep.value === 4 ? 2 : 1
  } else if (newVal === InternalProgress.CONTACT) {
    currStep.value = maxStep.value === 4 ? 3 : 2
  } else if (newVal === InternalProgress.SHARE) {
    currStep.value = maxStep.value === 4 ? 4 : 3
  }
})

useHead({
  title: 'Bill Creator',
  meta: [
    {
      property: 'og:title',
      content: 'Bill Creator | Split Bill',
    },
  ],
})

</script>

<template>
  <div v-if="loading" class="flex-1 text-2xl place-content-center"><p>Loading...</p></div>
  <div v-if="error" class="flex-1 text-2xl place-content-center"><p>{{ error }}</p></div>
  <template v-if="data">
    <Creator v-if="internalProgress === InternalProgress.CREATOR" />
    <Contact v-if="internalProgress === InternalProgress.CONTACT" />
    <Share v-if="internalProgress === InternalProgress.SHARE" />
  </template>
</template>

<style scoped>

</style>
