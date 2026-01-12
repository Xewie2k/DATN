import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import DiscountPage from '../view/admin/DiscountPage.vue'
// 1. Import trang mới
import AddDiscountPage from '../view/admin/AddDiscountPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'discounts',
        name: 'Discounts',
        component: DiscountPage
      },
      // 2. Thêm route cho trang thêm mới
      {
        path: 'discounts/create',
        name: 'AddDiscount',
        component: AddDiscountPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
