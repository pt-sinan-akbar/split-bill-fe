<script setup lang="ts">
import { computed, inject, type Ref, ref } from 'vue'
import BaseButton from '@/components/elements/BaseButton.vue'
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import BaseTable from '@/components/elements/BaseTable.vue'
import SliderModal from '@/components/elements/Modal/SliderModal.vue'
import PrevButton from '@/components/elements/Button/Variants/PrevButton.vue'
import InitialAvatar from '@/components/elements/InitialAvatar.vue'
import BaseInput from '@/components/elements/BaseInput.vue'
import BaseAccordion from '@/components/elements/BaseAccordion.vue'
import type { Bill, BillItem, BillMemberItem, BillMember } from '@/types/Bill'
import router from '@/router'
import { InternalProgress } from '@/types/BillCreatorInternalProgress'
import axios from 'axios'

const userContainerList = ref<Array<any>>([])
const touchStartX = ref<number>(0)
const touchEndX = ref<number>(0)
const isReviewing = ref<boolean>(false)
const errAssign = ref<HTMLElement | null>(null)
const errMsg = ref<string>('')
const internalProgress = inject('internalProgress') as Ref<InternalProgress>
const isNewMember = ref<boolean>(false)
const newMemberInput = ref<HTMLInputElement | null>(null)
const longPressTimer = ref<number | null>(null)
const isLongPressing = ref<boolean>(false)
const memberInputRefs = ref<Map<number, HTMLInputElement>>(new Map())
const editableMemberIds = ref<Set<number>>(new Set())
const isUserSwiping = ref<boolean>(false)
const swipeOffset = ref<Map<number, number>>(new Map())
const showDeleteBackground = ref<Set<number>>(new Set())
const bill = inject('bill') as Ref<Bill>

const currentSelectedItem = ref<BillItem>({
  id: 0,
  bill_id: '',
  name: '',
  discount: 0,
  price: 0,
  qty: 0,
  tax: 0,
  service: 0,
  subtotal: 0,
  created_at: '',
  updated_at: '',
  bill_member: null
})
const currentSelectedItemSplitMode = ref<'person' | 'equal'>('person')

const newItem = ref({
  name: '',
  price: 0,
  qty: 0
})

const body = computed<Array<Array<string>>>(() => {
  return bill.value.bill_item.map(item => [
    (item.id ?? 0).toString(),
    item.name,
    item.subtotal.toString()
  ])
})

const showAssignModal = ref<boolean>(false)
const showEditItemModal = ref<boolean>(false)
const showAddItemModal = ref<boolean>(false)

const addNewUser = ($event: Event): void => {
  const newMemberName = ($event.target as HTMLInputElement).value.trim()
  // request from BE for new member with empty name, then push to props
  bill.value.bill_member.push({
    id: bill.value.bill_member.length + 1,
    bill_id: bill.value.id,
    name: newMemberName,
    price_owe: null
  })
  isNewMember.value = false
}

const handleEditItem = (): void => {
  toogleShowModal()
  toogleShowEditItemModal()
}

const handleDeleteItem = async (): Promise<void> => {
  const billId = bill.value.id
  const itemId = currentSelectedItem.value.id
  try {
    const updatedBillResponse = await axios.delete(`/api/v1/bills/dynamic/${billId}/item/${itemId}`)
    if (updatedBillResponse.status !== 200) {
      throw new Error('Failed to update item')
    }
    bill.value = updatedBillResponse.data as Bill
    clearActiveItemBill()
    toogleShowEditItemModal()
  } catch (error) {
    console.error('Error update item:', error)
    // TODO: tambahin loading sama error indicator
  }
}

const editItemBill = async (): Promise<void> => {
  const billId = bill.value.id
  const itemId = currentSelectedItem.value.id
  try {
    const updatedBillResponse = await axios.put(`/api/v1/bills/dynamic/${billId}/item/${itemId}`, {
      name: currentSelectedItem.value.name,
      price: currentSelectedItem.value.price,
      quantity: currentSelectedItem.value.qty
    })
    if (updatedBillResponse.status === 200) {
      bill.value = updatedBillResponse.data as Bill
      currentSelectedItem.value = bill.value.bill_item.find(item => item.id === itemId)
    } else if (updatedBillResponse.status !== 202) {
      throw new Error('Failed to update item')
    }
    toogleShowEditItemModal()
    toogleShowModal()
  } catch (error) {
    console.error('Error update item:', error)
    // TODO: tambahin loading sama error indicator
  }
}

const toogleShowModal = () => (showAssignModal.value = !showAssignModal.value)
const toogleReviewing = () => (isReviewing.value = !isReviewing.value)
const handleClickBillItem = (data: Array<string>): void => {
  const id = parseInt(data[0])
  // deep copy to prevent edit auto-change props value, may be removed if we can figure out how to revert if request fail
  currentSelectedItem.value = { ...bill.value.bill_item.find(item => item.id === id) } as BillItem
  // item is split equally if there's BillMemberItem with null qty
  if (bill.value.bill_member_item.some(memberItems => memberItems.bill_item_id === id && memberItems.qty === null)) {
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
  const memberItem: BillMemberItem | undefined = getMemberItem(member.id, currentSelectedItem.value.id)
  if (memberItem && memberItem.qty !== null) {
    if (operation === 'add') {
      // request first, then update props if success
      memberItem.qty++
    } else if (operation === 'sub') {
      if (memberItem.qty === 1) {
        bill.value.bill_member_item = bill.value.bill_member_item.filter(im => im.bill_member_id !== memberItem.bill_member_id && im.bill_item_id !== memberItem.bill_item_id)
      } else {
        memberItem.qty--
      }
    }
  }
}

const handleSelectUser = (user: BillMember): void => {
  // TODO: user bakal banyak edit disini, kayaknya terlalu banyak network call kalo satu per satu,
  //       harusnya bisa di batch update pake temporary ref
  if (currentSelectedItemSplitMode.value === 'person' && !isMemberHasThisItem(user.id, currentSelectedItem.value.id)) {
    const newMemberItem: BillMemberItem = {
      bill_id: bill.value.id,
      bill_item_id: currentSelectedItem.value.id ?? 0,
      bill_member_id: user.id ?? 0,
      qty: 1
    }
    // request first, then update bill.value if success
    bill.value.bill_member_item.push(newMemberItem)
  } else if (currentSelectedItemSplitMode.value === 'equal') {
    const memberItems: BillMemberItem | undefined = getMemberItem(user.id, currentSelectedItem.value.id)
    if (memberItems) {
      // request first, then update bill.value if success
      bill.value.bill_member_item = bill.value.bill_member_item.filter(im => im.bill_member_id !== memberItems.bill_member_id && im.bill_item_id !== memberItems.bill_item_id)
    } else {
      const newMemberItem: BillMemberItem = {
        bill_id: bill.value.id,
        bill_item_id: currentSelectedItem.value.id ?? 0,
        bill_member_id: user.id ?? 0,
        qty: null
      }
      // request first, then update bill.value if success
      bill.value.bill_member_item.push(newMemberItem)
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
    bill_id: '',
    name: '',
    discount: 0,
    price: 0,
    qty: 0,
    tax: 0,
    service: 0,
    subtotal: 0,
    created_at: '',
    updated_at: ''
  }
  currentSelectedItemSplitMode.value = 'person'
}

const getMemberItem = (member_id: number | undefined, item_id: number | undefined): BillMemberItem | undefined => {
  if (member_id === undefined || item_id === undefined) {
    return undefined
  }
  return bill.value.bill_member_item.find(
    memberItem => memberItem.bill_item_id === item_id && memberItem.bill_member_id === member_id
  )
}

const isMemberHasThisItem = (member_id: number | undefined, item_id: number | undefined): boolean => {
  if (member_id === undefined || item_id === undefined) {
    return false
  }
  return getMemberItem(member_id, item_id) !== undefined
}

const getItemQtyForThisMember = (member_id: number | undefined, item_id: number | undefined): number | null => {
  if (member_id === undefined || item_id === undefined) {
    return null
  }
  const memberItem = getMemberItem(member_id, item_id)
  if (memberItem) {
    return memberItem.qty
  }
  return null
}

const handleConfirmation = (): void => {
  console.log('bill.value: ', bill.value)
  internalProgress.value = InternalProgress.CONTACT
}

const handleSplitModeChanges = (mode: 'person' | 'equal'): void => {
  if (mode === currentSelectedItemSplitMode.value) {
    return
  }
  currentSelectedItemSplitMode.value = mode
  if (mode === 'equal') {
    // set all item member qty to null
    bill.value.bill_member_item.forEach(memberItem => {
      if (memberItem.bill_item_id === currentSelectedItem.value.id) {
        memberItem.qty = null
      }
    })
  } else {
    // set all item member qty to 1
    bill.value.bill_member_item.forEach(memberItem => {
      if (memberItem.bill_item_id === currentSelectedItem.value.id) {
        memberItem.qty = 1
      }
    })
  }
}

const handleAddItem = async (): Promise<void> => {
  try {
    const updatedBillResponse = await axios.post(`/api/v1/bills/dynamic/${bill.value.id}/item/`, {
      name: newItem.value.name,
      price: newItem.value.price,
      quantity: newItem.value.qty
    })
    if (updatedBillResponse.status !== 201) {
      throw new Error('Failed to add item')
    }
    bill.value = updatedBillResponse.data as Bill
    toggleShowAddItemModal()
    // clear new item data
    newItem.value = {
      name: '',
      price: 0,
      qty: 0
    }
  } catch (error) {
    console.error('Error adding item:', error)
    // TODO: tambahin loading sama error indicator
  }
}

const handleAddUserClick = (): void => {
  isNewMember.value = true
  setTimeout(() => {
    if (newMemberInput.value) {
      newMemberInput.value.focus()
    }
  }, 0)
}

const handleMemberNameChange = (member_id: number | undefined, $event: Event): void => {
  // TODO: edit member masih ngebug
  // stupid typescript
  if (member_id) {
    const selectedMember = bill.value.bill_member.find(member => member.id === member_id)
    if (selectedMember) {
      selectedMember.name = ($event.target as HTMLInputElement).value
    }
    editableMemberIds.value.delete(member_id)
  }
}
// functions below is vibe coded, idk bout these logics
const handleTouchStart = (memberId: number | undefined, event: TouchEvent): void => {
  if (memberId === undefined) return
  isLongPressing.value = false
  touchStartX.value = event.changedTouches[0].screenX
  longPressTimer.value = setTimeout(() => {
    isLongPressing.value = true
  }, 500) as unknown as number // 500ms for long press detection
}

const handleTouchEnd = (memberId: number | undefined, event?: TouchEvent): void => {
  if (event) {
    touchEndX.value = event.changedTouches[0].screenX
  }

  if (memberId === undefined) return

  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null

    // Only focus for editing if it was a long press AND not a swipe
    if (isLongPressing.value && memberId && !isUserSwiping.value) {
      editableMemberIds.value.add(memberId)
      const input = memberInputRefs.value.get(memberId)
      if (input) {
        setTimeout(() => {
          input.readOnly = false
          input.focus()
          input.click()
        }, 10)
      }
    }
  }

  // Animate back or complete delete based on swipe distance
  const swipeDist = touchStartX.value - touchEndX.value
  if (swipeDist > 100) { // Delete threshold
    // Animate fully off-screen
    swipeOffset.value.set(memberId, window.innerWidth)

    // Actually delete after animation completes
    setTimeout(() => {
      // TODO: request buat delete member
      bill.value.bill_member = bill.value.bill_member.filter(user => user.id !== memberId)
      bill.value.bill_member_item = bill.value.bill_member_item.filter(
        item => item.bill_member_id !== memberId
      )
      swipeOffset.value.delete(memberId)
      showDeleteBackground.value.delete(memberId)
    }, 300) // Match transition duration
  } else {
    // Reset the animation
    swipeOffset.value.delete(memberId)
    showDeleteBackground.value.delete(memberId)
  }

  isUserSwiping.value = false
}

const handleTouchMove = (event: TouchEvent, memberId?: number): void => {
  // Cancel long press if finger moves
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }

  if (memberId === undefined) return

  // Mark that the user is swiping
  const currentX = event.touches[0].screenX
  const moveDistance = touchStartX.value - currentX

  if (moveDistance > 10) { // Small threshold to detect intentional movement
    isUserSwiping.value = true

    // Only allow leftward swipes (positive moveDistance)
    if (moveDistance > 0) {
      // Update the swipe offset (capped at 100px max)
      swipeOffset.value.set(memberId, Math.min(moveDistance, 100))

      // Show delete background when swiped more than halfway
      if (moveDistance > 10) {
        showDeleteBackground.value.add(memberId)
      } else {
        showDeleteBackground.value.delete(memberId)
      }
    }
  }
}

const registerInputRef = (memberId: number | undefined, el: any): void => {
  if (el && memberId) {
    memberInputRefs.value.set(memberId, el)
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
        <BaseTitle className="text-center" tag="h6" :msg="bill.name" />
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
        <!--   TODO TLDR: value disini belum ngubah value di bill            -->
        <div class="flex justify-between mt-5">
          <BaseParagraph msg="Tax" />
          <BaseParagraph :contenteditable="true" :msg="bill.bill_data.tax.toString()" />
        </div>
        <div class="flex justify-between">
          <BaseParagraph msg="Service" />
          <BaseParagraph :contenteditable="true" :msg="bill.bill_data.service.toString()" />
        </div>
        <div class="flex justify-between mt-5">
          <BaseParagraph className="font-semibold" msg="Total" />
          <BaseParagraph :msg="bill.bill_data.total.toString()" />
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
            v-for="member in bill.bill_member"
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
                  v-for="item in bill.bill_item.filter((item2) =>
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
          <div class="flex justify-between gap-x-5 *:*:text-gray-500">
            <div class="flex flex-col gap-y-2 w-full" v-if="currentSelectedItem.tax > 0">
              <BaseParagraph msg="Tax" />
              <BaseParagraph :msg="currentSelectedItem.tax.toString()" />
            </div>
            <div class="flex flex-col gap-y-2 w-full" v-if="currentSelectedItem.service > 0">
              <BaseParagraph msg="Service" />
              <BaseParagraph :msg="currentSelectedItem.service.toString()" />
            </div>
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
            :outline="!(currentSelectedItemSplitMode === 'person')"
            msg="Split per person"
            @handle-click="handleSplitModeChanges('person')"
            :class="!(currentSelectedItemSplitMode === 'person') ? '!text-black hover:!text-white' : '!text-white hover:!text-white'"
          />
          <BaseParagraph msg="or" />
          <BaseButton
            :outline="!(currentSelectedItemSplitMode === 'equal')"
            msg="Split equally"
            @handle-click="handleSplitModeChanges('equal')"
            :class="!(currentSelectedItemSplitMode === 'equal') ? '!text-black hover:!text-white' : '!text-white hover:!text-white'"
          />
        </div>
        <div
          v-for="(member, index) in bill.bill_member"
          :key="member.id"
          :ref="el => (userContainerList[index] = el)"
          class="relative overflow-hidden"
        >
          <!-- Delete indicator background -->
          <div
            class="absolute inset-0 flex items-center justify-end bg-red-500 text-white pr-4"
            :class="{ 'opacity-100': showDeleteBackground.has(member.id ?? 0), 'opacity-0': !showDeleteBackground.has(member.id ?? 0) }"
          >
            <span>Delete</span>
          </div>

          <!-- Main content with swipe animation -->
          <div
            :class="[
              'flex gap-x-5 border-b-2 p-3 items-center relative',
              (isMemberHasThisItem(member.id, currentSelectedItem.id)) ? 'bg-yellow-100' : 'bg-white'
            ]"
            :style="{
              transform: `translateX(-${swipeOffset.get(member.id ?? 0) || 0}px)`,
              transition: isUserSwiping ? 'none' : 'transform 0.3s ease'
            }"
            @click="handleSelectUser(member)"
            @touchstart="(e) => { isUserSwiping = false; handleTouchStart(member.id, e) }"
            @touchend="(e) => { handleTouchEnd(member.id, e); }"
            @touchmove="(e) => handleTouchMove(e, member.id)"
          >
            <div class="w-fit">
              <InitialAvatar :name="member.name" />
            </div>
            <div
              class="flex justify-between items-center w-full"
            >
              <input type="text"
                     class="w-full text-lg bg-transparent outline-none border-0 focus:outline-none focus:ring-0"
                     :value="member.name"
                     @blur="handleMemberNameChange(member.id, $event)"
                     :ref="el => registerInputRef(member.id, el)"
                     :readonly="!editableMemberIds.has(member.id ?? 0)"
              />
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
        <div class="flex gap-x-5 border-b-2 p-3 items-center bg-white" v-if="isNewMember">
          <div class="w-fit">
            <div class="rounded-full bg-gray-400 w-10 h-10" />
          </div>
          <input ref="newMemberInput" type="text"
                 class="w-full text-lg bg-transparent outline-none border-0"
                 @blur="addNewUser($event)" />
        </div>
        <BaseParagraph
          ref="errAssign"
          :msg="errMsg"
          class-name="text-red-500 mb-2 mt-3"
        />
        <div class="flex gap-x-5 my-3 justify-end">
          <BaseButton
            @handle-click="handleAddUserClick"
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
