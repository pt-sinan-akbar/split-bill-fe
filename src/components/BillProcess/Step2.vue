<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTable from '../elements/BaseTable.vue'
import SliderModal from '../elements/Modal/SliderModal.vue'
import PrevButton from '../elements/Button/Variants/PrevButton.vue'
import InitialAvatar from '../elements/InitialAvatar.vue'
import BaseInput from '../elements/BaseInput.vue'
import BaseAccordion from '../elements/BaseAccordion.vue'

const emit = defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

interface AssignTo {
  id: number
  name: string
  image?: string
  isSelected: boolean
  items: Map<number, ItemBill>
}

interface ItemBill {
  id: number
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
const taxBill = ref<number>(10000)
const isReviewing = ref<boolean>(false)
const isSelectedItem = ref<boolean>(false)
const errAssign = ref<HTMLElement | null>(null)
const errMsg = ref<string>('')

const itemBillDetail = ref<ItemBill>({
  id: 0,
  Quantity: 0,
  name: '',
  price: 0,
})

const activeItemBIll = ref<ItemBill>({
  id: 0,
  Quantity: 0,
  name: '',
  price: 0,
})

// TODO: Refactor the dummy data to use the interface
const body = ref<Array<Array<string>>>([
  ['1', 'Pizza', '3', '15000'],
  ['2', 'Burger', '3', '15000'],
  ['3', 'idk', '3', '15000'],
])
const showAssignModal = ref<boolean>(false)
const showEditItemModal = ref<boolean>(false)
const assignTo = ref<Array<AssignTo>>([
  {
    id: 1,
    name: 'John Doe',
    isSelected: false,
    items: new Map<number, ItemBill>(),
  },
  {
    id: 2,
    name: 'Jane Doe',
    isSelected: false,
    items: new Map<number, ItemBill>(),
  },
  {
    id: 3,
    name: 'John Doe',
    isSelected: false,
    items: new Map<number, ItemBill>(),
  },
])

const addNewUser = (): void => {
  assignTo.value.push({
    id: assignTo.value.length + 1,
    name: 'New User',
    image: 'https://randomuser.me/api/portraits/thumb/women/96.jpg',
    isSelected: false,
    items: new Map<number, ItemBill>(),
  })
}

const checkDirection = (index: number): void => {
  const isSwipeLeft = touchEndX.value < touchStartX.value
  if (isSwipeLeft) {
    const removeUser = (index: number): void => {
      assignTo.value = assignTo.value.filter(user => user.id !== index + 1)
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
    id: parseInt(data[0]),
    name: data[1],
    Quantity: parseInt(data[2]),
    price: parseInt(data[3]),
  }
  currEditIndexData.value = indexData
  toogleShowEditItemModal()
}

const editItemBill = (): void => {
  const { name, Quantity, price } = itemBillDetail.value
  body.value[currEditIndexData.value] = [
    name,
    Quantity.toString(),
    price.toString(),
  ]
  toogleShowEditItemModal()
}

const toogleShowModal = () => (showAssignModal.value = !showAssignModal.value)
const toogleReviewing = () => (isReviewing.value = !isReviewing.value)
const handleClickBillItem = (data: Array<string>): void => {
  activeItemBIll.value = {
    id: parseInt(data[0]),
    name: data[1],
    Quantity: parseInt(data[2]),
    price: parseInt(data[3]),
  }
  assignTo.value.map(user => {
    const userHasActiveItem: ItemBill | undefined = user.items.get(
      activeItemBIll.value.id,
    )
    if (userHasActiveItem) {
      user.isSelected = true
    }
  })
  toogleShowModal()
}
const toogleShowEditItemModal = () =>
  (showEditItemModal.value = !showEditItemModal.value)

const totalBillPrice = computed<string>(() => {
  let total: number = 0
  body.value.map(item => {
    let subTotal: number = parseInt(item[1]) * parseInt(item[2])
    total += subTotal
  })
  total += taxBill.value
  return total.toString()
})

const changeQuantity = (user: AssignTo, operation: 'add' | 'sub'): void => {
  const currItemId: number = activeItemBIll.value.id
  const userItem: ItemBill | undefined = user.items.get(currItemId)
  if (!userItem) return
  if (operation === 'add') {
    activeItemBIll.value.Quantity++
    userItem.Quantity--
    if (userItem.Quantity === 0) handleSelectUser(user)
  } else {
    activeItemBIll.value.Quantity--
    userItem.Quantity++
  }
}

const handleSelectUser = (user: AssignTo): void => {
  const activeItemId = activeItemBIll.value.id
  if (!user.isSelected) {
    let billTemp: ItemBill = { ...activeItemBIll.value }
    billTemp.price = 0
    billTemp.Quantity = 0
    user.items.set(activeItemId, billTemp)
  } else {
    const userItem: ItemBill | undefined = user.items.get(activeItemId)
    if (!userItem) return
    activeItemBIll.value.Quantity += userItem.Quantity
    user.items.delete(activeItemId)
  }
  user.isSelected = !user.isSelected
}
const handleIsDisabled = (user: AssignTo): boolean => {
  const activeItemId = activeItemBIll.value.id
  const userItem: ItemBill | undefined = user.items.get(activeItemId)
  if (!userItem) return true
  return userItem.Quantity === 0
}

const handleSubmitAssignItem = (): void => {
  let isValid: boolean = true
  // ISSUE: Performace issue
  assignTo.value.map(user => {
    const userItem: ItemBill | undefined = user.items.get(
      activeItemBIll.value.id,
    )
    if (user.isSelected && userItem && userItem.Quantity === 0) {
      errMsg.value = 'Please assign the item to the user'
      isValid = false
    }
  })
  if (isValid) {
    assignTo.value.map(user => {
      user.isSelected = false
    })
    clearActiveItemBill()
    showAssignModal.value = false
  }
}

const handleCancelAssignItem = (): void => {
  const activeItemId = activeItemBIll.value.id
  clearUserBillItem(activeItemId)
  clearActiveItemBill()
  showAssignModal.value = false
}

const clearUserBillItem = (itemId: number) => {
  assignTo.value.map(user => {
    const userItem: ItemBill | undefined = user.items.get(itemId)
    if (userItem) {
      user.items.delete(itemId)
    }
    user.isSelected = false
  })
}

const clearActiveItemBill = (): void => {
  activeItemBIll.value = {
    id: 0,
    Quantity: 0,
    name: '',
    price: 0,
  }
}
</script>

<template>
  <div class="h-screen flex flex-col justify-between">
    <div class="flex flex-col gap-y-10">
      <section class="flex flex-col gap-y-3">
        <BaseTitle className="text-center" tag="h5" msg="List of Items" />
        <BaseParagraph
          className="text-center"
          msg="Select an item and assign to someone, you may edit if something wrong"
        />
      </section>
      <section class="flex flex-col gap-y-5">
        <BaseTitle className="text-center" tag="h6" :msg="billTitle" />
        <BaseTable
          :withNumber="false"
          :body="body"
          @handle-click="handleClickBillItem"
          :has-edit-action="true"
          @handle-hold="handleEditItem"
        />
        <div class="flex justify-between mt-5">
          <BaseParagraph msg="Tax" />
          <BaseParagraph :contenteditable="true" msg="11000" />
        </div>
        <div class="flex justify-between">
          <BaseParagraph msg="Service" />
          <BaseParagraph :contenteditable="true" :msg="taxBill.toString()" />
        </div>
        <div class="flex justify-between mt-5">
          <BaseParagraph className="font-semibold" msg="Total" />
          <BaseParagraph :msg="totalBillPrice" />
        </div>
      </section>
    </div>
    <div class="w-full flex gap-x-3">
      <PrevButton @handleClick="emit('prev-step')" />
      <BaseButton
        msg="Review Items"
        type="button"
        @handleClick="toogleReviewing"
      />
    </div>
    <!-- Review Items -->
    <!--
        TODO:
        * Add bill items based on the users have
        * Move this modal to separate component
    -->
    <SliderModal :show-modal="isReviewing">
      <template v-slot:header>
        <BaseTitle tag="h5" msg="Review Items" />
      </template>
      <template v-slot:body>
        <div class="flex gap-y-5 pb-5 items-center flex-col">
          <BaseAccordion
            v-for="(item, index) in assignTo"
            :key="item.id"
            :ref="el => (userContainerList[index] = el)"
          >
            <template v-slot:title>
              <div class="flex gap-x-5 items-center">
                <img
                  v-if="item.image"
                  :src="item.image"
                  alt="profile-preview"
                  width="30"
                  height="30"
                  class="rounded-full block"
                />
                <InitialAvatar v-else :name="item.name" />
                <BaseParagraph :contenteditable="true" :msg="item.name" />
              </div>
            </template>
            <template v-slot:body>
              <ol>
                <li v-for="[_, it] in [...item.items]" :key="index">
                  {{ it.name }}
                </li>
              </ol>
            </template>
          </BaseAccordion>
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex gap-x-5">
          <BaseButton
            msg="Cancel"
            type="button"
            @handleClick="toogleReviewing"
            color="red"
            :outline="true"
          />
          <BaseButton
            msg="Done"
            type="button"
            @handle-click="emit('next-step')"
          />
        </div>
      </template>
    </SliderModal>
    <!-- Edit Item -->
    <!--
        TODO:
        * Move this modal to separate component
    -->
    <SliderModal :showModal="showEditItemModal">
      <template v-slot:header>
        <BaseTitle tag="h5" msg="Edit Item" class="w-full text-start" />
      </template>
      <template v-slot:body>
        <div class="flex flex-col gap-y-5">
          <BaseInput
            v-model:model-value="itemBillDetail.name"
            placeholder="Item Name"
            label="Item Name"
            type="text"
          />
          <div class="flex justify-between gap-x-5">
            <BaseInput
              v-model:model-value="itemBillDetail.price"
              placeholder="Price"
              label="Price"
              type="number"
            />
            <BaseInput
              v-model:model-value="itemBillDetail.Quantity"
              placeholder="Quantity"
              label="Quantity"
              type="number"
            />
          </div>
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex justify-between gap-x-3 mt-5 sticky top-0">
          <PrevButton @handleClick="toogleShowEditItemModal" />
          <BaseButton msg="Done" type="button" @handle-click="editItemBill" />
        </div>
      </template>
    </SliderModal>
    <!-- Assign Item -->
    <!--
        TODO:
        * Move this modal to separate component
        FIX:
        * Swipe event still has bug
    -->
    <SliderModal :showModal="showAssignModal">
      <template v-slot:header>
        <div class="flex flex-col gap-y-5">
          <BaseTitle class="text-center" tag="h5" msg="Assign Items" />
          <BaseTitle tag="h6" :msg="activeItemBIll.name" />
        </div>
      </template>
      <template v-slot:body>
        <div class="w-full flex gap-y-5 flex-col justify-start">
          <div
            class="flex gap-x-5 border-b-2 pb-3 items-center"
            v-for="(item, index) in assignTo"
            :key="item.id"
            :ref="el => (userContainerList[index] = el)"
          >
            <img
              v-if="item.image"
              :src="item.image"
              alt="profile-preview"
              width="30"
              height="30"
              class="rounded-full block"
            />
            <InitialAvatar v-else :name="item.name" />
            <div
              class="flex justify-between items-center w-full"
              @click="handleSelectUser(item)"
            >
              <BaseParagraph :contenteditable="false" :msg="item.name" />
              <div class="flex gap-x-3 items-center" v-if="item.isSelected">
                <BaseButton
                  :outline="true"
                  msg="-"
                  :is-disabled="handleIsDisabled(item)"
                  @handle-click="changeQuantity(item, 'add')"
                />
                <BaseParagraph
                  :msg="
                    item.items.get(activeItemBIll.id)?.Quantity.toString() ??
                    '0'
                  "
                />
                <BaseButton
                  msg="+"
                  :is-disabled="activeItemBIll.Quantity === 0"
                  @handle-click="changeQuantity(item, 'sub')"
                />
              </div>
            </div>
          </div>
        </div>
        <BaseParagraph
          ref="errAssign"
          :msg="errMsg"
          class-name="text-red-500 mb-2 mt-3"
        />
        <div class="flex gap-x-5 my-3 justify-end">
          <BaseButton
            @handle-click="addNewUser"
            :outline="true"
            size="sm"
            msg="Add user ..."
          />
        </div>
        <div>
          <BaseParagraph msg="Tips" />
          <BaseParagraph msg="Swipe left to delete" />
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex justify-between gap-x-3 sticky top-0">
          <!-- TODO:
               * change prev button to cancel button
            -->
          <BaseButton
            msg="Cancel"
            type="button"
            @handleClick="handleCancelAssignItem"
            color="red"
            :outline="true"
          />
          <BaseButton
            msg="Done"
            type="button"
            @handleClick="handleSubmitAssignItem"
          />
        </div>
      </template>
    </SliderModal>
  </div>
</template>
