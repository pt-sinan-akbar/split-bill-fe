<script setup lang="ts">
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

const props = withDefaults(
  defineProps<{
    header?: Array<string>
    className?: string
    body: Array<Array<string>>
    withNumber: boolean
  }>(),
  {
    withNumber: true,
  },
)
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
        <fwb-table-cell
          v-for="(data, colIndex) in bd" :key="colIndex" :class="colIndex !== 0 && colIndex !== body.length - 1
            ? 'text-center'
            : ''
          " contenteditable="true" :style="{ 'padding-left': '0px', 'padding-right': '0px' }">
          {{ data }}
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
</template>
