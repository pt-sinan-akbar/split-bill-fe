<script setup lang="ts">
import { computed, inject, onMounted, type Ref, ref } from 'vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import BaseTable from '@/components/elements/BaseTable.vue'
import SliderModal from '@/components/elements/Modal/SliderModal.vue'
import PrevButton from '@/components/elements/Button/Variants/PrevButton.vue'
import InitialAvatar from '@/components/elements/InitialAvatar.vue'
import BaseInput from '@/components/elements/BaseInput.vue'
import BaseAccordion from '@/components/elements/BaseAccordion.vue'
import type { Bill, BillItem, BillItemMember, BillMember } from '@/types/Bill'
import router from '@/router'
import { InternalProgress } from '@/types/BillCreatorInternalProgress'

const props = defineProps<{
  bill: Bill
}>()

const userContainerList = ref<Array<any>>([])
const touchStartX = ref<number>(0)
const touchEndX = ref<number>(0)
const isReviewing = ref<boolean>(false)
const errAssign = ref<HTMLElement | null>(null)
const errMsg = ref<string>('')
const internalProgress = inject('internalProgress') as Ref<InternalProgress>

const currentSelectedItem = ref<BillItem>({
  id: 0,
  name: '',
  discount: 0,
  price: 0,
  qty: 0,
  tax: 0,
  service: 0,
  subtotal: 0
})
const currentSelectedItemSplitMode = ref<'person' | 'equal'>('person')

const newItem = ref<BillItem>({
  id: 0,
  name: '',
  discount: 0,
  price: 0,
  qty: 0,
  tax: 0,
  service: 0,
  subtotal: 0
})

const body = computed<Array<Array<string>>>(() => {
  return props.bill.items.map(item => [
    item.id.toString(),
    item.name,
    item.price.toString()
  ])
})

const showAssignModal = ref<boolean>(false)
const showEditItemModal = ref<boolean>(false)
const showAddItemModal = ref<boolean>(false)

const addNewUser = (): void => {
  // request from BE for new member with empty name, then push to props
  props.bill.members.push({
    id: props.bill.members.length + 1,
    name: 'New User'
  })
}

const checkDirection = (id: number): void => {
  const isSwipeLeft = touchEndX.value < touchStartX.value
  if (isSwipeLeft) {
    // delete user, request first then update props.bill if success
    props.bill.members = props.bill.members.filter(user => user.id !== id)
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

const handleEditItem = (): void => {
  toogleShowModal()
  toogleShowEditItemModal()
}

const handleDeleteItem = (): void => {
  const id = currentSelectedItem.value.id
  // request first, then update props.bill if success
  clearActiveItemBill()
  props.bill.items = props.bill.items.filter(item => item.id !== id)
  toogleShowEditItemModal()
}

const editItemBill = (): void => {
  // set to props if request success
  const item = props.bill.items.find(item2 => item2.id === currentSelectedItem.value.id)
  if (item) {
    item.name = currentSelectedItem.value.name
    item.price = currentSelectedItem.value.price
    item.qty = currentSelectedItem.value.qty
  }
  toogleShowEditItemModal()
  toogleShowModal()
}

const toogleShowModal = () => (showAssignModal.value = !showAssignModal.value)
const toogleReviewing = () => (isReviewing.value = !isReviewing.value)
const handleClickBillItem = (data: Array<string>): void => {
  const id = parseInt(data[0])
  // deep copy to prevent edit auto-change props value, may be removed if we can figure out how to revert if request fail
  currentSelectedItem.value = { ...props.bill.items.find(item => item.id === id) } as BillItem
  // item is split equally if there's BillItemMember with null qty
  if (props.bill.items_members.some(itemMember => itemMember.item_id === id && itemMember.qty === null)) {
    currentSelectedItemSplitMode.value = 'equal'
  } else {
    currentSelectedItemSplitMode.value = 'person'
  }
  toogleShowModal()
}
const toogleShowEditItemModal = () =>
  (showEditItemModal.value = !showEditItemModal.value)

const toggleShowAddItemModal = () =>
  (showAddItemModal.value = !showAddItemModal.value)

const changeQuantity = (member: BillMember, operation: 'add' | 'sub'): void => {
  const itemMember: BillItemMember | undefined = getItemMember(member.id, currentSelectedItem.value.id)
  if (itemMember && itemMember.qty !== null) {
    if (operation === 'add') {
      // request first, then update props if success
      itemMember.qty++
    } else if (operation === 'sub') {
      if (itemMember.qty === 1) {
        props.bill.items_members = props.bill.items_members.filter(im => im.id !== itemMember.id)
      } else {
        itemMember.qty--
      }
    }
  }
}

const handleSelectUser = (user: BillMember): void => {
  if (currentSelectedItemSplitMode.value === 'person' && !isMemberHasThisItem(user.id, currentSelectedItem.value.id)) {
    const newItemMember: BillItemMember = {
      id: props.bill.items_members.length + 1,
      item_id: currentSelectedItem.value.id,
      member_id: user.id,
      qty: 1
    }
    props.bill.items_members.push(newItemMember)
  }
  else if (currentSelectedItemSplitMode.value === 'equal') {
    const itemMember: BillItemMember | undefined = getItemMember(user.id, currentSelectedItem.value.id)
    if (itemMember) {
      props.bill.items_members = props.bill.items_members.filter(im => im.id !== itemMember.id)
    } else {
      const newItemMember: BillItemMember = {
        id: props.bill.items_members.length + 1,
        item_id: currentSelectedItem.value.id,
        member_id: user.id,
        qty: null
      }
      props.bill.items_members.push(newItemMember)
    }
  }
}

const handleSubmitAssignItem = (): void => {
  clearActiveItemBill()
  toogleShowModal()
}
const clearActiveItemBill = (): void => {
  currentSelectedItem.value = {
    id: 0,
    name: '',
    discount: 0,
    price: 0,
    qty: 0,
    tax: 0,
    service: 0,
    subtotal: 0
  }
  currentSelectedItemSplitMode.value = 'person'
}

const getItemMember = (member_id: number, item_id: number): BillItemMember | undefined => {
  return props.bill.items_members.find(
    itemMember => itemMember.item_id === item_id && itemMember.member_id === member_id
  )
}

const isMemberHasThisItem = (member_id: number, item_id: number): boolean => {
  return getItemMember(member_id, item_id) !== undefined
}

const getItemQtyForThisMember = (member_id: number, item_id: number): number | null => {
  const itemMember = getItemMember(member_id, item_id)
  if (itemMember) {
    return itemMember.qty
  }
  return null
}

const handleConfirmation = (): void => {
  console.log('props.bill: ', props.bill)
  internalProgress.value = InternalProgress.CONTACT
}

const handleSplitModeChanges = (mode: 'person' | 'equal'): void => {
  if (mode === currentSelectedItemSplitMode.value) {
    return
  }
  currentSelectedItemSplitMode.value = mode
  if (mode === 'equal') {
    // set all item member qty to null
    props.bill.items_members.forEach(itemMember => {
      if (itemMember.item_id === currentSelectedItem.value.id) {
        itemMember.qty = null
      }
    })
  } else {
    // set all item member qty to 1
    props.bill.items_members.forEach(itemMember => {
      if (itemMember.item_id === currentSelectedItem.value.id) {
        itemMember.qty = 1
      }
    })
  }
}

const handleAddItem = (): void => {
  // request first, then update props.bill if success
  const newItemData: BillItem = {
    id: props.bill.items.length + 1,
    name: newItem.value.name,
    discount: newItem.value.discount,
    price: newItem.value.price,
    qty: newItem.value.qty,
    tax: newItem.value.tax,
    service: newItem.value.service,
    subtotal: newItem.value.subtotal
  }
  props.bill.items.push(newItemData)
  toggleShowAddItemModal()
  // clear new item data
  newItem.value = {
    id: 0,
    name: '',
    discount: 0,
    price: 0,
    qty: 0,
    tax: 0,
    service: 0,
    subtotal: 0
  }
}

</script>

<template>
  <div class="flex flex-col justify-between">
    <div class="flex flex-col gap-y-10">
      <section class="flex flex-col gap-y-3">
        <BaseTitle className="text-center" tag="h5" msg="List of Items" />
        <BaseParagraph
          className="text-center"
          msg="Select an item and assign to someone, you may edit if something wrong"
        />
      </section>
      <section class="flex flex-col gap-y-5">
        <BaseTitle className="text-center" tag="h6" :msg="props.bill.name" />
        <div class="flex flex-col gap-y-3">
          <BaseTable
            :withNumber="false"
            :body="body"
            @handle-click="handleClickBillItem"
            :hide-row-id="true"
          />
          <BaseButton
            msg="Add Item"
            type="button"
            @handle-click="toggleShowAddItemModal"
            :outline="true"
          />
        </div>
        <!--   TODO: Tax and Service auto-change ref value or use separate handler on change    -->
        <!--   TODO TLDR: value disini belum ngubah value di props.bill            -->
        <div class="flex justify-between mt-5">
          <BaseParagraph msg="Tax" />
          <BaseParagraph :contenteditable="true" :msg="props.bill.data.tax.toString()" />
        </div>
        <div class="flex justify-between">
          <BaseParagraph msg="Service" />
          <BaseParagraph :contenteditable="true" :msg="props.bill.data.service.toString()" />
        </div>
        <div class="flex justify-between mt-5">
          <BaseParagraph className="font-semibold" msg="Total" />
          <BaseParagraph :msg="props.bill.data.total.toString()" />
        </div>
      </section>
    </div>
    <!-- Review Items -->
    <!--
        TODO:
        * Move this modal to separate component
    -->
    <SliderModal v-if="isReviewing">
      <template v-slot:header>
        <BaseTitle tag="h5" msg="Review Items" />
      </template>
      <template v-slot:body>
        <div class="flex gap-y-5 pb-5 items-center flex-col h-80 overflow-y-scroll">
          <BaseAccordion
            v-for="member in props.bill.members"
            :key="member.id"
          >
            <template v-slot:title>
              <div class="flex gap-x-5 items-center">
                <InitialAvatar :name="member.name" />
                <BaseParagraph :contenteditable="false" :msg="member.name" />
              </div>
            </template>
            <template v-slot:body>
              <ol>
                <li
                  v-for="item in props.bill.items.filter((item2) =>
                            isMemberHasThisItem(member.id, item2.id)
                          )"
                  :key="item.id"
                >
                  <span>{{ item.name }}</span>
                  <span v-if="getItemQtyForThisMember(member.id, item.id) !== null">
                    x{{ getItemQtyForThisMember(member.id, item.id) }}
                  </span>
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
            @handle-click="handleConfirmation"
          />
        </div>
      </template>
    </SliderModal>
    <!-- Edit Item -->
    <!--
        TODO:
        * Move this modal to separate component
    -->
    <SliderModal v-if="showEditItemModal">
      <template v-slot:header>
        <div class="flex">
          <BaseTitle tag="h5" msg="Edit Item" class="w-full text-start" />
          <div class="p-4 bg-red-500" @click="handleDeleteItem" />
        </div>
      </template>
      <template v-slot:body>
        <div class="flex flex-col gap-y-5">
          <BaseInput
            v-model:model-value="currentSelectedItem.name"
            placeholder="Item Name"
            label="Item Name"
            type="text"
          />
          <div class="flex justify-between gap-x-5">
            <BaseInput
              v-model:model-value="currentSelectedItem.price"
              placeholder="Price"
              label="Price"
              type="number"
            />
            <BaseInput
              v-model:model-value="currentSelectedItem.qty"
              placeholder="Quantity"
              label="Quantity"
              type="number"
            />
          </div>
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex justify-between gap-x-3 mt-5 sticky top-0">
          <PrevButton @handleClick="() => {
            toogleShowEditItemModal()
            toogleShowModal()
          }" />
          <BaseButton msg="Done" type="button" @handle-click="editItemBill" />
        </div>
      </template>
    </SliderModal>
    <!-- Assign Item -->
    <!--
        TODO:
        * Move this modal to separate component
        FIX:
        * Swipe event still has bug (dan yap, masih)
    -->
    <SliderModal v-if="showAssignModal">
      <template v-slot:header>
        <div class="flex">
          <BaseTitle tag="h6" :msg="currentSelectedItem.name" />
          <div class="p-4 bg-yellow-300" @click="handleEditItem" />
        </div>
      </template>
      <template v-slot:body>
        <div class="w-full flex space-x-5 items-center justify-around my-5 text-nowrap">
          <BaseButton
            :outline="currentSelectedItemSplitMode === 'equal'"
            msg="Split per person"
            @handle-click="handleSplitModeChanges('person')"
          />
          <BaseParagraph msg="or" />
          <BaseButton
            :outline="currentSelectedItemSplitMode === 'person'"
            msg="Split equally"
            @handle-click="handleSplitModeChanges('equal')"
          />
        </div>
        <div class="w-full flex flex-col justify-start max-h-60 overflow-y-scroll">
          <div
            v-for="(member, index) in props.bill.members"
            :key="member.id"
            :ref="el => (userContainerList[index] = el)"
            :class="[
              'flex gap-x-5 border-b-2 p-3 items-center',
              (isMemberHasThisItem(member.id, currentSelectedItem.id)) ? 'bg-yellow-100' : 'bg-white'
            ]"
          >
            <div class="w-fit">
              <InitialAvatar :name="member.name" />
            </div>
            <div
              class="flex justify-between items-center w-full"
              @click="handleSelectUser(member)"
            >
              <!--    TODO: member name auto-change ref value or use separate handler on change     -->
              <!--    TODO TLDR: value disini belum ngubah value di props.bill            -->
              <BaseParagraph :contenteditable="true" :msg="member.name" />
              <div class="flex gap-x-3 items-center"
                   v-if="isMemberHasThisItem(member.id, currentSelectedItem.id) && currentSelectedItemSplitMode === 'person'">
                <BaseButton
                  :outline="true"
                  msg="-"
                  @handle-click="changeQuantity(member, 'sub')"
                />
                <BaseParagraph
                  :msg="getItemQtyForThisMember(member.id, currentSelectedItem.id)?.toString() || '0'"
                />
                <BaseButton
                  :outline="true"
                  msg="+"
                  @handle-click="changeQuantity(member, 'add')"
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
        <div class="flex place-content-center gap-x-3 sticky top-0">
          <BaseButton
            msg="Done"
            type="button"
            @handleClick="handleSubmitAssignItem"
          />
        </div>
      </template>
    </SliderModal>
    <!-- Add Item -->
    <!--
        TODO:
        * Move this modal to separate component
    -->
    <SliderModal v-if="showAddItemModal">
      <template v-slot:header>
        <div class="flex">
          <BaseTitle tag="h5" msg="Add Item" class="w-full text-start" />
        </div>
      </template>
      <template v-slot:body>
        <div class="flex flex-col gap-y-5">
          <BaseInput
            v-model:model-value="newItem.name"
            placeholder="Item Name"
            label="Item Name"
            type="text"
          />
          <div class="flex justify-between gap-x-5">
            <BaseInput
              v-model:model-value="newItem.price"
              placeholder="Price"
              label="Price"
              type="number"
            />
            <BaseInput
              v-model:model-value="newItem.qty"
              placeholder="Quantity"
              label="Quantity"
              type="number"
            />
          </div>
        </div>
      </template>
      <template v-slot:fotoer>
        <div class="flex justify-between gap-x-3 mt-5 sticky top-0">
          <PrevButton @handleClick="toggleShowAddItemModal" />
          <BaseButton msg="Done" type="button" @handle-click="handleAddItem" />
        </div>
      </template>
    </SliderModal>
  </div>
  <div class="w-full flex gap-x-3 mt-auto">
    <PrevButton @handleClick="router.back()" />
    <BaseButton
      msg="Review Items"
      type="button"
      @handleClick="toogleReviewing"
    />
  </div>
</template>
