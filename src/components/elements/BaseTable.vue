<script setup lang="ts">
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    header?: Array<string>
    className?: string
    body: Array<Array<string>>
    withNumber: boolean
    hasEditAction?: boolean
    isEditable?: boolean
  }>(),
  {
    withNumber: true,
    hasEditAction: false,
    isEditable: false
  },
)

const emit = defineEmits<{
  (e: 'handleHold', data: string): void
  (e: 'handleEdit', data: Array<string>, indexData: number): void
}>()

const holdDuration = ref<number>(500)
const holdTimeout = ref<NodeJS.Timeout | null>(null)

const handleWhenHolding = (e: MouseEvent, data: string): void => {
  holdTimeout.value = setTimeout(() => {
    emit('handleHold', data)
  }, holdDuration.value)
}

const handleEdit = (_: MouseEvent, data: Array<string>, indexData: number): void => {
  emit('handleEdit', data, indexData)
}

const handleWhenStopHolding = (): void => {
  clearTimeout(holdTimeout.value as NodeJS.Timeout)
}

const editIcon = `
  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
  </svg>
  `
</script>

<template>
  <fwb-table class="shadow-none text-start">
    <fwb-table-head class="w-full">
      <fwb-table-head-cell v-if="withNumber">No.</fwb-table-head-cell>
      <fwb-table-head-cell v-for="(item, index) in header" :key="index">
        {{ item }}
      </fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="(bd, rowIndex) in body" :key="rowIndex">
        <fwb-table-cell v-if="withNumber">
          {{ rowIndex + 1 }}</fwb-table-cell>
        <fwb-table-cell v-for="(data, colIndex) in bd" :key="colIndex" @touchstart="handleWhenHolding($event, data)"
          @touchend="handleWhenStopHolding" :contenteditable="isEditable">
          {{ data }}
        </fwb-table-cell>
        <fwb-table-cell v-if="hasEditAction" v-html="editIcon" @click="handleEdit($event, bd, rowIndex)">
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>
