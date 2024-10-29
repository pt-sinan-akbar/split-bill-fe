<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <main>
        <RouterLink :to="{ name: 'add-split-bill' }">
            Add split bill
        </RouterLink>
        <RouterView />
    </main>
</template>
