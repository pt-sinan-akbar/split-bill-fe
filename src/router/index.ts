import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/start',
      name: 'add-split-bill',
      component: () => import('../components/BillProcess/Index.vue'),
    },
    {
      path: '/s/:id',
      name: 'share',
      component: () => import('../views/ShareView.vue'),
    },
  ],
})

export default router
