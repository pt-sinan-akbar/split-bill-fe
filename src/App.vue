<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios'
import { useHead } from '@unhead/vue'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

useHead({
  title: 'Home',
  titleTemplate: '%s | Split Bill',
  meta: [
    {
      property: 'description',
      content: 'Split Bill is a PWA to help you split bills with your friends.',
    },
    {
      property: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    {
      property: 'og:title',
      content: 'Home | Split Bill',
    },
    {
      property: 'og:description',
      content: 'Split Bill is a PWA to help you split bills with your friends.',
    },
    {
      property: 'og:url',
      content: () => `https://splitbill.dta32.my.id/`,
    },
    {
      property: 'og:image',
      content: 'https://splitbill.dta32.my.id/ujang.png',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
