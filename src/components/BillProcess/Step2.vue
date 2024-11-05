<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTable from '../elements/BaseTable.vue'
import SliderModal from '../elements/Modal/SliderModal.vue'

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

interface AssignTo {
  id: number
  name: string
  image: string
}

const assignToDummy = [
  {
    id: 1,
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/thumb/men/87.jpg',
  },
  {
    id: 2,
    name: 'Jane Doe',
    image: 'https://randomuser.me/api/portraits/thumb/women/82.jpg',
  },
  {
    id: 3,
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/thumb/women/96.jpg',
  },
]

const billTitle = ref<string>('Bill Title')
const header = ref<Array<string>>(['Bill Name', 'Quantity', 'Price'])
const body = ref<Array<Array<string>>>([['Pizza', '3', '15000']])
const showModal = ref<boolean>(false)
const assignTo = ref<Array<AssignTo>>([])

onMounted(() => {
  assignTo.value = assignToDummy
})

const toogleShowModal = () => (showModal.value = !showModal.value)
</script>

<template>
  <section class="flex flex-col gap-y-3">
    <BaseTitle className="text-center" tag="h5" msg="List of Items" />
    <BaseParagraph className="text-center"
      msg="Select an item and assign to someone, you may edit if something wrong" />
  </section>
  <section class="flex flex-col gap-y-5">
    <BaseTitle className="text-center" tag="h6" :msg="billTitle" />
    <BaseTable :withNumber="false" :body="body" />
  </section>
  <div class="w-full flex justify-between">
    <BaseButton msg="Previous" type="button" @handleClick="emit('prev-step')" />
    <BaseButton msg="Assign Items" type="button" @handleClick="toogleShowModal" />
  </div>
  <SliderModal :showModal="showModal">
    <template v-slot:header>
      <div class="flex flex-col gap-y-5">
        <BaseTitle class="text-center" tag="h5" msg="Assign Items" />
        <div class="flex justify-between items-center">
          <BaseTitle tag="h6" msg="Ayam Geprek" />
          <BaseParagraph msg="15000" />
        </div>
      </div>
    </template>
    <template v-slot:body>
      <div class="w-full flex gap-y-5 flex-col justify-start">
        <div class="flex gap-x-5 border-b-2 pb-3 " v-for="item in assignTo" :key="item.id">
          <img :src="item.image" alt="profile-preview" width="30" height="30" class="rounded-full block" />
          <BaseParagraph :msg="item.name" />
        </div>
        <div>
          <BaseParagraph msg="Tips" />
          <BaseParagraph msg="Long-press to edit person name or swipe left to delete" />
        </div>
      </div>
    </template>
    <template v-slot:fotoer>
      <div class="flex justify-around gap-x-5">
        <BaseButton msg="Cancel" type="button" @handleClick="showModal = false" />
        <BaseButton msg="Done" type="button" />
      </div>
    </template>
  </SliderModal>
</template>
