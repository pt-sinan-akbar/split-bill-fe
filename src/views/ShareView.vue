<script setup lang="ts">
import Navbar from '@/components/elements/Navbar.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import { useRoute } from 'vue-router'
import Member from '@/components/share/Member.vue'
import { computed, ref, watch } from 'vue'
import type { BillSummary } from '@/types/BillSummary'
import axios from 'axios'

const route = useRoute()
const billId = route.params.id as string;

const loading = ref<boolean>(true)
const data = ref<BillSummary | null>(null)
const error = ref<string | null>(null)

// TODO: move this to a separate file for API calls
const useBillSummary = async (id: string): Promise<BillSummary> => {
  try {
    const response = await axios.get(`/api/v1/bills/${id}/summary`)
    if(response.status !== 200){
      throw new Error('Error')
    }
    return response.data as BillSummary
  } catch (error) {
    console.error('Error fetching bill:', error)
    throw new Error('Failed to fetch bill data')
  }
}

async function fetchData(id: string) {
  try {
    loading.value = true
    data.value = await useBillSummary(id)
    error.value = null
  } catch (err) {
    console.error('Error fetching bill:', err)
    error.value = 'Failed to fetch bill data'
  } finally {
    loading.value = false
  }
}
watch(() => billId, fetchData, { immediate: true })

const displayContact = computed<string>(() => {
  if (data.value){
    if (data.value.name !== '' && data.value.contact.name !== '') {
      return `${data.value.contact.name} - ${data.value.contact.contact}`
    }
    return `${data.value.contact.name}${data.value.contact.contact}`
  } else {
    return ''
  }
})

</script>

<template>
  <Navbar />
  <section class="mx-9 flex flex-col min-h-screen">
    <div class="flex flex-col flex-1 text-center" v-if="loading">
      <BaseParagraph msg="Split Bill" />
      <p class="flex-1 text-2xl place-content-center">Loading...</p>
    </div>
    <div class="flex flex-col flex-1 text-center" v-if="error">
      <BaseParagraph msg="Split Bill" />
      <p class="flex-1 text-2xl place-content-center">{{ error }}</p>
    </div>
    <template v-if="data">
      <div class="flex flex-col justify-center items-center gap-1">
        <BaseParagraph msg="Split Bill" />
        <BaseParagraph
          :msg="data.name"
          className="text-center font-medium text-2xl"
        />
      </div>
      <div class="flex flex-col my-10 gap-10">
        <div class="flex flex-col gap-3">
          <BaseParagraph
            :msg="`Bill ID #${data.bill_id}`"
            class-name="text-gray-500 text-sm"
          />
          <div class="flex flex-col divide-y">
            <div
              class="flex flex-col gap-3 py-4"
              v-for="member in data.members"
              :key="member.name"
            >
              <Member :member="member" />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <BaseParagraph msg="Pay to" className="text-2xl" />
          <div class="flex flex-col *:text-gray-500">
            <BaseParagraph
              :msg="displayContact"
              className="text-xl"
            />
            <BaseParagraph :msg="data.contact.bank_account" className="text-xl" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 justify-center items-center mt-20 mb-4">
        <BaseParagraph msg="Want to split your bill too?" />
        <RouterLink to="/" class="py-2 px-12 bg-primary-color rounded-3xl">
          Try now
        </RouterLink>
      </div>
    </template>
  </section>
</template>

<style scoped></style>
