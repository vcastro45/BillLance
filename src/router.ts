import { createRouter, createWebHistory } from 'vue-router'
import CRA from '@/views/CRA.vue'
import Contracts from '@/views/Contracts.vue'
import Settings from '@/views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'CRA' }
  },
  {
    path: '/cra',
    name: 'CRA',
    component: CRA
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: Contracts
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
