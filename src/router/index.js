import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/Views/HomeView.vue'
import TransactionView from '@/Views/TransactionView.vue'
import FormView from '@/Views/FormView.vue'
import SettingsView from '@/Views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionView
    },
    {
      path: '/add',
      name: 'add',
      component: FormView // 새 거래 등록
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: FormView // 기존 거래 수정 (id 파라미터 포함)
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

export default router