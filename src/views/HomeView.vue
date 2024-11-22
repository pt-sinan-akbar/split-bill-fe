<script setup lang="ts">
import BaseTitle from '@/components/elements/Typography/BaseTitle.vue'
import BaseParagraph from '@/components/elements/Typography/BaseParagraph.vue'
import BaseButton from '@/components/elements/BaseButton.vue'
</script>

<template>
  <div class="bg-fixed h-[45vh] bg-[url('/home_bg.png')]" />
  <div
    class="bg-white px-8 py-12 flex flex-col justify-center items-center text-center gap-8"
  >
    <BaseTitle tag="h3" msg="Save your time and money" className="pb-2" />
    <div class="flex flex-col gap-6 items-center">
      <BaseParagraph
        msg="Only four steps to split bill and share to your friends. Split the bill not the friendship!"
      />
      <div class="flex gap-2">
        <div
          class="rounded-full w-16 h-3 bg-gradient-to-r from-indigo-500 to-gray-300"
        />
        <div class="rounded-full w-8 h-3 bg-gray-300" />
        <div class="rounded-full w-8 h-3 bg-gray-300" />
      </div>
    </div>
    <RouterLink :to="{ name: 'add-split-bill' }">
      <BaseButton
        msg="Get Started"
        className="py-3 px-8 bg-primary-color rounded-3xl text-black"
        type="button"
      />
    </RouterLink>
  </div>
</template>

<style scoped></style>
