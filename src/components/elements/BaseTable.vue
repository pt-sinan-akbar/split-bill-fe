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
    isEditable: false,
  },
)

const emit = defineEmits<{
  (e: 'handleHold', data: Array<string>, rowIndex: number): void
  (e: 'handleClick', data: Array<string>): void
  (e: 'handleEdit', data: Array<string>, indexData: number): void
}>()

const holdDuration = ref<number>(500)
const holdTimeout = ref<NodeJS.Timeout | null>(null)

const handleClick = (e: MouseEvent, data: Array<string>): void => {
  emit('handleClick', data)
}

const handleWhenHolding = (
  _: MouseEvent,
  body: Array<string>,
  rowIndex: number,
): void => {
  holdTimeout.value = setTimeout(() => {
    emit('handleHold', body, rowIndex)
  }, holdDuration.value)
}

const handleEdit = (
  _: MouseEvent,
  data: Array<string>,
  indexData: number,
): void => {
  emit('handleEdit', data, indexData)
}

const handleWhenStopHolding = (): void => {
  clearTimeout(holdTimeout.value as NodeJS.Timeout)
}
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
      <fwb-table-row
        v-for="(bd, rowIndex) in body"
        :key="rowIndex"
        @click="handleClick($event, bd)"
        @touchstart="handleWhenHolding($event, bd, rowIndex)"
        @touchend="handleWhenStopHolding"
      >
        <fwb-table-cell v-if="withNumber"> {{ rowIndex + 1 }}</fwb-table-cell>
        <fwb-table-cell
          v-for="(data, colIndex) in bd"
          :key="colIndex"
          :contenteditable="isEditable"
        >
          {{ data }}
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>
