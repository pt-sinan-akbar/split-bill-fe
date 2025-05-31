<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
</script>

<template>
  <RouterView />
</template>
