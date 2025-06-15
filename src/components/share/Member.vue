<script setup lang="ts">
import PriceParagraph from '@/components/elements/Typography/PriceParagraph.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import {
  FwbAccordion,
  FwbAccordionContent,
  FwbAccordionHeader,
  FwbAccordionPanel,
} from 'flowbite-vue'
import InitialAvatar from '@/components/elements/InitialAvatar.vue'
import { type BillSummaryMember } from '@/types/BillSummary'

const { member } = defineProps<{
  member: BillSummaryMember
}>()

const getItemQty = (item: { qty: number; name: string }): string => {
  return item.qty > 0 ? `x${item.qty}` : ''
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-between items-center w-full">
      <div class="flex gap-3 items-center">
        <InitialAvatar :name="member.name" />
        <BaseParagraph
          :msg="member.name"
          className="text-lg line-clamp-1 !mr-4"
        />
      </div>
      <PriceParagraph :price="member.price_owe" className="text-lg" />
    </div>
    <!--  TODO: pake BaseAccordion yang dibuat Lord Dimas  -->
    <fwb-accordion flush :open-first-item="false">
      <fwb-accordion-panel
        v-for="(item, index) in member.items"
        :key="index"
        :title="item.name"
      >
        <fwb-accordion-header class="text-lg *:border-0">
          <div class="flex justify-between items-center">
            <div class="flex gap-1 items-center">
              <BaseParagraph :msg="item.name" />
              <BaseParagraph :msg="getItemQty(item)" className="text-sm" />
            </div>
            <PriceParagraph
              :price="item.total"
              className="text-sm text-gray-400 pe-2"
            />
          </div>
        </fwb-accordion-header>
        <fwb-accordion-content class="*:py-0 *:border-0">
          <div class="flex flex-col mx-2 gap-2">
            <div class="flex flex-col mx-2 gap-1 *:text-sm">
              <div class="flex justify-between">
                <BaseParagraph msg="Price" />
                <PriceParagraph :price="item.price" />
              </div>
              <div class="flex justify-between">
                <BaseParagraph msg="Tax" />
                <PriceParagraph :price="item.tax" />
              </div>
              <div class="flex justify-between">
                <BaseParagraph msg="Service" />
                <PriceParagraph :price="item.service" />
              </div>
            </div>
            <div class="flex justify-between">
              <BaseParagraph msg="Subtotal" />
              <PriceParagraph :price="item.total" />
            </div>
          </div>
        </fwb-accordion-content>
      </fwb-accordion-panel>
    </fwb-accordion>
  </div>
</template>

<style scoped></style>
