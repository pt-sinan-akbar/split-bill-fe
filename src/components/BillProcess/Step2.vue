<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTable from '../elements/BaseTable.vue'
import SliderModal from '../elements/Modal/SliderModal.vue'

const emit = defineEmits<{
    (e: 'next-step'): void
    (e: 'prev-step'): void
}>()

const billTitle = ref<string>('Bill Title')
const header = ref<Array<string>>(['Bill Name', 'Quantity', 'Price'])
const body = ref<Array<string>>([['Pizza', '3', '15000']])
const showModal = ref<boolean>(false)

const toogleShowModal = () => (showModal.value = !showModal.value)
</script>

<template>
    <section class="flex flex-col gap-y-3">
        <BaseTitle className="text-center" tag="h5" msg="List of Items" />
        <BaseParagraph
            className="text-center"
            msg="Select an item and assign to someone, you may edit if something wrong"
        />
    </section>
    <section class="flex flex-col gap-y-5">
        <BaseTitle className="text-center" tag="h6" :msg="billTitle" />
        <BaseTable :withNumber="false" :body="body" />
    </section>
    <div class="w-full flex justify-between">
        <BaseButton
            msg="Previous"
            type="button"
            @handleClick="emit('prev-step')"
        />
        <BaseButton
            msg="Assign Items"
            type="button"
            @handleClick="toogleShowModal"
        />
    </div>
    <SliderModal :showModal="showModal">
        <template v-slot:header>
            <BaseTitle tag="h5" msg="Assign Items" />
        </template>
        <template v-slot:body>
            <p>Hello world</p>
        </template>
        <template v-slot:fotoer>
            <div class="flex w-full gap-x-5">
                <BaseButton
                    msg="Cancel"
                    type="button"
                    @handleClick="showModal= false"
                />
                <BaseButton msg="Done" type="button" />
            </div>
        </template>
    </SliderModal>
</template>
