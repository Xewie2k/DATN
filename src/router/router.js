import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import DiscountPage from '../view/admin/DiscountPage.vue'
import AddDiscountPage from '../view/admin/AddDiscountPage.vue'
import DetailDiscountPage from '../view/admin/DetailDiscountPage.vue'

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
      {
        path: 'discount/create',
        name: 'AddDiscount',
        component: AddDiscountPage
      },
      {
        path: 'discount/detail/:id',
        name: 'DetailDiscount',
        component: DetailDiscountPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
