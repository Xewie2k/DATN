<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <img :src="logo" alt="Logo" />
      </div>

      <ul class="menu">
        <li v-for="(item, index) in menuItems" :key="index" class="menu-item-container">
          <div
            class="menu-item"
            :class="{ active: item.active || (item.isOpen && !item.active) }"
            @click="toggleMenu(index)"
          >
            <div class="menu-link">
              <span class="material-icons icon">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </div>
            <span v-if="item.children" class="arrow" :class="{ rotated: item.isOpen }">
              <span class="material-icons">expand_more</span>
            </span>
          </div>

          <ul v-if="item.children && item.isOpen" class="submenu">
            <li v-for="(child, cIndex) in item.children" :key="cIndex">
              <RouterLink :to="child.link" class="submenu-link" active-class="sub-active">
                {{ child.label }}
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <main class="main-wrapper">
      <header class="top-header">
    <button class="icon-btn"><span class="material-icons cursor-pointer">dark_mode</span></button>
    <div class="header-divider"></div>
        <button class="icon-btn"><span class="material-icons">account_circle</span></button>
    <button class="icon-btn"><span class="material-icons small">expand_more</span></button>
      </header>

      <div class="content-body">
         <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import logo from '../images/logo_moi.jpg'; // Import logo

const menuItems = ref([
  {
    label: 'Tổng quan',
    icon: 'grid_view',
    link: '/dashboard',
    active: false
  },
  {
    label: 'Quản Lý Hóa Đơn',
    icon: 'shopping_bag',
    link: '/invoices',
    active: false
  },
  {
    label: 'Bán Hàng Tại Quầy',
    icon: 'shopping_cart',
    link: '/pos',
    active: false
  },
  {
    label: 'Quản Lý Sản Phẩm',
    icon: 'inventory_2',
    isOpen: false,
    children: [
      { label: 'Danh sách sản phẩm', link: '/products' },
      { label: 'Thuộc tính', link: '/attributes' }
    ]
  },
  {
    label: 'Quản Lý Tài Khoản',
    icon: 'group',
    isOpen: false,
    children: [
      { label: 'Nhân viên', link: '/staff' },
      { label: 'Khách hàng', link: '/customers' }
    ]
  },
  {
    label: 'Quản Lý Khuyến Mãi',
    icon: 'local_offer',
    isOpen: true, // Giữ nguyên dòng này nếu bạn muốn menu con luôn xổ xuống sẵn
    active: false, // <--- SỬA DÒNG NÀY: Chuyển từ true thành false
    children: [
      { label: 'Phiếu giảm giá', link: '/coupons' },
      { label: 'Đợt giảm giá', link: '/discounts' }
    ]
  },
]);

const toggleMenu = (index) => {
  if (menuItems.value[index].children) {
    menuItems.value[index].isOpen = !menuItems.value[index].isOpen;
  }
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #f9f9f9;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  border-right: 1.5px solid #d7d6d6;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}
.logo img {
  width: 80px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  color: #666;
  font-weight: 500;
  transition: 0.3s;
  border-radius: 8px;
  margin-bottom: 5px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-link .icon {
  width: 30px;
  height: 30px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- PHẦN ĐÃ SỬA --- */
/* Khi hover vào menu cha thì hiện màu cam */
.menu-item:hover {
  background-color: #ffe5e5; /* Nền hồng nhạt */
  color: #ff4757; /* Chữ đỏ cam */
}

/* Style cho Active (giữ nguyên để đồng bộ) */
.menu-item.active {
  background-color: #ffe5e5;
  color: #ff4757;
}

.arrow {
  font-size: 12px;
  transition: transform 0.3s;
}
.rotated {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  padding-left: 20px;
  margin-bottom: 10px;
}

.submenu-link {
  display: block;
  padding: 10px 15px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  border-radius: 8px;
  transition: 0.2s;
}

/* --- PHẦN ĐÃ SỬA --- */
/* Khi hover vào menu con cũng hiện màu nền cam */
.submenu-link:hover {
  background-color: #ffe5e5;
  color: #ff4757;
}

.router-link-active, .sub-active {
  background-color: #ffe5e5;
  color: #ff4757;
  font-weight: 600;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  height: 65px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1.5px solid #d7d6d6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon-btn {
  background: none;
  border: none;
  font-size: 20px;
  margin-left: 15px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #6b7280;
}
.icon-btn:hover { background: #f1f1f1; }

.header-divider {
  height: 24px;
  width: 1px;
  background-color: #d1d5db;
  margin-left: 15px;
}

/* Thu hẹp khoảng cách giữa icon account và mũi tên (cursor) */
.icon-btn:last-child {
  margin-left: 2px;
}

.content-body {
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
}
</style>
