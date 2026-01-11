import { createRouter, createWebHistory } from 'vue-router'

// 1. Import Layout
// Dùng ../ để lùi ra ngoài thư mục router, rồi đi vào layouts
import MainLayout from '../layouts/MainLayout.vue'

// 2. Import View
// Lưu ý: Thư mục trong ảnh là "view" (không có s) và nằm trong "admin"
import DiscountPage from '../view/admin/DiscountPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        // Khi vào đường dẫn /discounts sẽ hiện trang này
        path: 'discounts',
        name: 'Discounts',
        component: DiscountPage
      },
      // Sau này bạn thêm trang Dashboard thì import tương tự:
      // { path: 'dashboard', component: DashboardPage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
