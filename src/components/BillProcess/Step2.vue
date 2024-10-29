<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseTitle from '../elements/Typography/BaseTitle.vue'
import BaseParagraph from '../elements/Typography/BaseParagraph.vue'
import BaseTable from '../elements/BaseTable.vue'

const billTitle = ref<string>('Bill Title')

const header = ref<Array<string>>(['Bill Name', 'Quantity', 'Price'])
const body = ref<Array<string>>([['Pizza', '3', '15000']])
</script>

<template>
    <section class="flex flex-col gap-y-3">
        <BaseTitle className="text-center" tag="h5" msg="Assign Items" />
        <BaseParagraph
            className="text-center"
            msg="Select an item and assign to someone, you may edit if something wrong"
        />
    </section>
    <section class="flex flex-col gap-y-5">
        <BaseTitle className="text-center" tag="h6" :msg="billTitle" />
        <BaseTable :header="header" :body="body" />
    </section>
    <BaseButton color="yellow" msg="Continue" type="button" />
</template>
