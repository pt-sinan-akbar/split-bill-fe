import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
    },
    {
      path: '/split-bill/add',
      name: 'add-split-bill',
      component: () => import('../components/BillProcess/Index.vue'),
    },
  ],
})

export default router
