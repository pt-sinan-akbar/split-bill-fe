<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTable from '../elements/BaseTable.vue'
import SliderModal from '../elements/Modal/SliderModal.vue'
import PrevButton from '../elements/Button/Variants/PrevButton.vue'
import InitialAvatar from '../elements/InitialAvatar.vue'
import BaseInput from '../elements/BaseInput.vue'

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

interface AssignTo {
  id: number
  name: string
  image?: string
}

interface ItemBill {
  name: string
  Quantity: number
  price: number
}

const billTitle = ref<string>('Bill Title')
const header = ref<Array<string>>(['Bill Name', 'Quantity', 'Price'])
const userContainerList = ref<Array<any>>([])
const touchStartX = ref<number>(0)
const touchEndX = ref<number>(0)
const currEditIndexData = ref<number>(0)

const itemBillDetail = ref<ItemBill>({
  name: '',
  Quantity: 0,
  price: 0,
})

// TODO: Refactor the dummy data to use the interface
const body = ref<Array<Array<string>>>([
  ['Pizza', '3', '15000'],
  ['Burger', '3', '15000'],
  ['idk', '3', '15000'],
])
const showAssignModal = ref<boolean>(false)
const showEditItemModal = ref<boolean>(false)
const assignTo = ref<Array<AssignTo>>([
  {
    id: 1,
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/thumb/men/87.jpg',
  },
  {
    id: 2,
    name: 'Jane Doe',
    image: 'https://randomuser.me/api/portraits/thumb/men/87.jpg',
  },
  {
    id: 3,
    name: 'John Doe',
  },
])

const addNewUser = (): void => {
  assignTo.value.push({
    id: assignTo.value.length + 1,
    name: 'New User',
    image: 'https://randomuser.me/api/portraits/thumb/women/96.jpg',
  })
}

const checkDirection = (index: number): void => {
  const isSwipeLeft = touchEndX.value < touchStartX.value
  if (isSwipeLeft) {
    const removeUser = (index: number): void => {
      assignTo.value = assignTo.value.filter(
        user => user.id !== index + 1,
      )
    }
    removeUser(index)
  }
}

onMounted(() => {
  userContainerList.value.forEach((el: HTMLElement, index: number) => {
    el.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartX.value = e.changedTouches[0].screenX
    })
    el.addEventListener('touchend', (e: TouchEvent) => {
      touchEndX.value = e.changedTouches[0].screenX
      checkDirection(index)
    })
  })
})

const handleEditItem = (data: Array<string>, indexData: number): void => {
  itemBillDetail.value = {
    name: data[0],
    Quantity: parseInt(data[1]),
    price: parseInt(data[2]),
  }
  currEditIndexData.value = indexData;
  toogleShowEditItemModal()
}

const editItemBill = (): void => {
  const { name, Quantity, price }  = itemBillDetail.value
  body.value[currEditIndexData.value] =  [name, Quantity.toString(), price.toString()]
  console.log("item detail: ", itemBillDetail.value)
  toogleShowEditItemModal()
}

const toogleShowModal = () => (showAssignModal.value = !showAssignModal.value)
const handleHold = (data: string): void => {
  toogleShowModal()
}
const toogleShowEditItemModal = () =>
  (showEditItemModal.value = !showEditItemModal.value)
</script>

<template>
  <div class="h-screen flex flex-col justify-between">
    <div class="flex flex-col gap-y-10">
      <section class="flex flex-col gap-y-3">
        <BaseTitle className="text-center" tag="h5" msg="List of Items" />
        <BaseParagraph className="text-center"
          msg="Select an item and assign to someone, you may edit if something wrong" />
      </section>
      <section class="flex flex-col gap-y-5">
        <BaseTitle className="text-center" tag="h6" :msg="billTitle" />
        <BaseTable :withNumber="false" :body="body" @handle-hold="handleHold" :has-edit-action="true"
          @handle-edit="handleEditItem" />
        <div class="flex justify-between mt-5">
          <BaseParagraph msg="Tax" />
          <BaseParagraph :contenteditable="true" msg="11000" />
        </div>
        <div class="flex justify-between">
          <BaseParagraph msg="Service" />
          <BaseParagraph :contenteditable="true" msg="11000" />
        </div>
        <div class="flex justify-between mt-5">
          <BaseParagraph className="font-semibold" msg="Total" />
          <BaseParagraph msg="11000" />
        </div>
      </section>
    </div>
    <div class="w-full flex gap-x-3">
      <PrevButton @handleClick="emit('prev-step')" />
      <BaseButton msg="Continue" type="button" @handleClick="toogleShowModal" />
      <!--  <BaseButton msg="Continue" type="button" @handleClick="emit('next-step')" /> -->
    </div>
    <!-- Edit Item -->
    <SliderModal :showModal="showEditItemModal">
      <template v-slot:header>
        <BaseTitle tag="h5" msg="Edit Item" class="w-full text-start" />
      </template>
      <template v-slot:body>
        <div class="flex flex-col gap-y-5">
          <BaseInput v-model:model-value="itemBillDetail.name" placeholder="Item Name" label="Item Name" type="text" />
          <div class="flex justify-between gap-x-5">
            <BaseInput v-model:model-value="itemBillDetail.price" placeholder="Price" label="Price" type="number" />
            <BaseInput v-model:model-value="itemBillDetail.Quantity" placeholder="Quantity" label="Quantity"
              type="number" />
          </div>
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex justify-between gap-x-3 mt-5 sticky top-0">
          <PrevButton @handleClick="toogleShowEditItemModal" />
          <BaseButton msg="Done" type="button" @handle-click="editItemBill"/>
        </div>
      </template>
    </SliderModal>
    <!-- Assign Item -->
    <SliderModal :showModal="showAssignModal">
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
          <div class="flex gap-x-5 border-b-2 pb-3" v-for="(item, index) in assignTo" :key="item.id"
            :ref="el => (userContainerList[index] = el)">
            <img v-if="item.image" :src="item.image" alt="profile-preview" width="30" height="30"
              class="rounded-full block" />
            <InitialAvatar v-else :name="item.name" />
            <BaseParagraph :contenteditable="true" :msg="item.name" />
          </div>
        </div>
        <div class="flex gap-x-5 my-3 justify-end">
          <BaseButton @handle-click="addNewUser" :outline="true" size="sm" msg="Add user ..." />
        </div>
        <div>
          <BaseParagraph msg="Tips" />
          <BaseParagraph msg="Long-press to edit person name or swipe left to delete" />
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex justify-between gap-x-3 sticky top-0">
          <PrevButton @handleClick="showAssignModal = false" />
          <BaseButton msg="Done" type="button" />
        </div>
      </template>
    </SliderModal>
  </div>
</template>
