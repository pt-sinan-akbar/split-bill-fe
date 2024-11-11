<script setup lang="ts">

import Navbar from '@/components/elements/Navbar.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import { useRoute } from 'vue-router'
import Member from '@/components/share/Member.vue'

const route = useRoute();

const mockData =
  {
    id: route.params.id,
    storeName: 'Rocky Anggrek',
    members: [
      {
        name: 'Abdul Syakur',
        priceOwe: 90000,
        items: [
          {
            name: 'Paket A',
            subtotal: 30000,
            price: 20000,
            tax: 3000,
            service: 7000
          },
          {
            name: 'Bintang Crystal',
            subtotal: 60000,
            price: 48000,
            tax: 9600,
            service: 2400
          }
        ]
      },
      {
        name: 'Mus Musculus',
        priceOwe: 700000,
        items: [
          {
            name: 'Ayam Kampus',
            subtotal: 700000,
            price: 500000,
            tax: 50000,
            service: 150000
          }
        ]
      }
    ],
    billOwner: {
      name: 'Zakwir',
      contact: '0812345678',
      payTo: 'BCA 0083322761'
    }
  }

</script>

<template>
  <Navbar/>
  <section class="mx-9">
    <div class="flex flex-col justify-center items-center gap-1">
      <BaseParagraph msg="Split Bill"/>
      <BaseParagraph :msg="mockData.storeName" className="text-center font-medium text-2xl"/>
    </div>
    <div class="flex flex-col my-10 gap-10">
      <div class="flex flex-col gap-3">
        <BaseParagraph :msg="`Bill ID #${mockData.id}`" class-name="text-gray-500 text-sm"/>
        <div class="flex flex-col divide-y">
          <div class="flex flex-col gap-3 first:pt-0 first:pb-3 last:pt-8 last:pb-0" v-for="member in mockData.members">
            <Member :member="member"/>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <BaseParagraph msg="Pay to" className="text-2xl"/>
        <div class="flex flex-col *:text-gray-500">
          <BaseParagraph :msg="`${mockData.billOwner.name} - ${mockData.billOwner.contact}`" className="text-xl"/>
          <BaseParagraph :msg="mockData.billOwner.payTo" className="text-xl"/>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-center items-center mt-20 mb-4">
      <BaseParagraph msg="Want to split your bill too?"/>
      <RouterLink to="/" class="py-2 px-12 bg-primary-color rounded-3xl"> Try now </RouterLink>
    </div>
  </section>
</template>

<style scoped>

</style>
