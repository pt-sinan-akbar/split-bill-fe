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
      name: 'get-started',
      component: () => import('../views/GetStartedView.vue'),
    },
    {
      path: '/bill-creator',
      component: () => import('../components/BillProcess/Index.vue'),
      children: [
        { path: 'scan', name: 'scan-bill', component: () => import('../components/BillProcess/BillScanner.vue') },
        { path: ':id', name: 'bill-creator-id', component: () => import('../components/BillProcess/BillCreator/BillCreator.vue')}
      ]
    },
    {
      path: '/s/:id',
      name: 'share',
      component: () => import('../views/ShareView.vue'),
    },
  ],
})

export default router
