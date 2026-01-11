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
              <span class="icon" v-html="item.icon"></span>
              <span class="label">{{ item.label }}</span>
            </div>
            <span v-if="item.children" class="arrow" :class="{ rotated: item.isOpen }">
              <i class="fa-solid fa-chevron-down"></i>
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
        <button class="icon-btn"><i class="fa-regular fa-moon"></i></button>
        <button class="icon-btn"><i class="fa-regular fa-user"></i></button>
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
    icon: '<i class="fa-solid fa-table-cells-large"></i>',
    link: '/dashboard',
    active: false
  },
  {
    label: 'Quản lý Hóa Đơn',
    icon: '<i class="fa-solid fa-bag-shopping"></i>',
    link: '/invoices',
    active: false
  },
  {
    label: 'Bán Hàng Tại Quầy',
    icon: '<i class="fa-solid fa-cart-shopping"></i>',
    link: '/pos',
    active: false
  },
  {
    label: 'Quản lý Sản phẩm',
    icon: '<i class="fa-solid fa-box-open"></i>',
    isOpen: false,
    children: [
      { label: 'Danh sách sản phẩm', link: '/products' },
      { label: 'Thuộc tính', link: '/attributes' }
    ]
  },
  {
    label: 'Quản lý Tài khoản',
    icon: '<i class="fa-solid fa-users"></i>',
    isOpen: false,
    children: [
      { label: 'Nhân viên', link: '/staff' },
      { label: 'Khách hàng', link: '/customers' }
    ]
  },
  {
    label: 'Quản lý Khuyến Mãi',
    icon: '<i class="fa-solid fa-tags"></i>',
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
  background: #E5E5E5;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}
.logo img {
  width: 150px;
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
  width: 20px;
  text-align: center;
  font-size: 18px;
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
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #ddd;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 20px;
  margin-left: 15px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}
.icon-btn:hover { background: #f1f1f1; }

.content-body {
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
}
</style>
