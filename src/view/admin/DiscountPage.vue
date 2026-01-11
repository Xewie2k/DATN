<template>
  <div class="discount-page">
    <h2 class="page-title">ĐỢT GIẢM GIÁ</h2>

    <div class="card filter-section">
      <div class="filter-row">
        <div class="input-group search-group">
          <span class="search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" placeholder="Tìm theo tên hoặc mã" />
        </div>

        <div class="input-group">
           <input type="datetime-local" class="date-input" />
        </div>
        <div class="input-group">
           <input type="datetime-local" class="date-input" />
        </div>
      </div>

      <div class="filter-row mt-3">
        <select class="custom-select">
          <option>Tất cả hình thức</option>
          <option>Công khai</option>
          <option>Cá nhân</option>
        </select>

        <select class="custom-select">
          <option>Tất cả trạng thái</option>
          <option>Sắp diễn ra</option>
          <option>Đang diễn ra</option>
        </select>

        <div class="filter-action">
          <input type="text" placeholder="Giá trị" class="value-input" />
          <button class="btn-filter"><i class="fa-solid fa-rotate-left"></i></button>
        </div>
      </div>
    </div>

    <div class="card table-section">
      <div class="table-header">
        <h3>Danh sách đợt giảm giá</h3>
        <button class="btn-add"><i class="fa-solid fa-plus"></i></button>
      </div>

      <table class="custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã</th>
            <th>Tên</th>
            <th>Loại</th>
            <th>Giá trị giảm</th>
            <th>Số lượng</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in discounts" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.quantity }}</td>
            <td>
              <div class="time">{{ item.startInfo.time }}</div>
              <div class="date">{{ item.startInfo.date }}</div>
            </td>
            <td>
              <div class="time">{{ item.endInfo.time }}</div>
              <div class="date">{{ item.endInfo.date }}</div>
            </td>
            <td>
              <span class="badge" :class="item.statusClass">{{ item.statusText }}</span>
            </td>
            <td class="action-cell">
              <button class="btn-view"><i class="fa-regular fa-eye"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button class="page-btn"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="page-btn active">1</button>
        <button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// const discounts = ref([
//   {
//     code: 'KM01',
//     name: 'Giảm 10% đơn hàng',
//     type: 'Công khai',
//     value: '20 %',
//     quantity: 1,
//     startInfo: { time: '00:58:00', date: '29/05/2026' },
//     endInfo: { time: '00:57:00', date: '01/06/2026' },
//     statusText: 'Sắp diễn ra',
//     statusClass: 'status-upcoming'
//   },
//   {
//     code: 'KM02',
//     name: 'Giảm 50k cho đơn hàng 300k',
//     type: 'Công khai',
//     value: '50000 VNĐ',
//     quantity: 1,
//     startInfo: { time: '00:00:00', date: '01/01/2026' },
//     endInfo: { time: '00:00:00', date: '31/12/2026' },
//     statusText: 'Đang diễn ra',
//     statusClass: 'status-active'
//   },
//   {
//     code: 'KM03',
//     name: 'Giảm 20% ngày lễ',
//     type: 'Công khai',
//     value: '20 %',
//     quantity: 1,
//     startInfo: { time: '00:00:00', date: '01/01/2026' },
//     endInfo: { time: '00:00:00', date: '31/12/2026' },
//     statusText: 'Sắp diễn ra',
//     statusClass: 'status-upcoming'
//   },
//   {
//     code: 'KM05',
//     name: 'Giảm 100k cho đơn hàng 1 triệu',
//     type: 'Công khai',
//     value: '20 %',
//     quantity: 1,
//     startInfo: { time: '00:00:00', date: '01/01/2026' },
//     endInfo: { time: '00:00:00', date: '31/12/2026' },
//     statusText: 'Bị vô hiệu hóa',
//     statusClass: 'status-disabled'
//   }
// ]);
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

/* Filter Styles */
.filter-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.mt-3 { margin-top: 15px; }

.input-group, .custom-select {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 10px 15px;
  font-size: 14px;
  outline: none;
  min-width: 200px;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-group input {
  border: none;
  outline: none;
  width: 100%;
}

.filter-action {
  flex: 1;
  display: flex;
  gap: 10px;
}
.value-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 0 15px;
}
.btn-filter {
  width: 45px;
  height: 40px;
  border-radius: 10px;
  background: #6c757d;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Table Styles */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.table-header h3 { font-size: 18px; margin: 0; }
.btn-add {
  width: 35px; height: 35px;
  border-radius: 50%;
  border: 1px solid #333;
  background: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th {
  text-align: left;
  padding: 15px 10px;
  background-color: #f2f2f2;
  font-weight: 600;
  font-size: 14px;
}

.custom-table td {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  vertical-align: middle;
}

.time { font-weight: bold; }
.date { font-size: 12px; color: #666; }

/* Badge Styles */
.badge {
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  min-width: 100px;
  text-align: center;
}
.status-upcoming { background-color: #3f51b5; }
.status-active { background-color: #2ecc71; }
.status-disabled { background-color: #c445f5; }

.btn-view {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.page-btn {
  width: 35px; height: 35px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn.active {
  background: #333;
  color: white;
  border-color: #333;
}
</style>
