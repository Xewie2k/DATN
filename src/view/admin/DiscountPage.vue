<template>
  <div class="discount-page">
    <h2 class="page-title">QUẢN LÝ ĐỢT GIẢM GIÁ</h2>

    <div class="card filter-section">
      <div class="filter-row">
        <div class="filter-item search-item">
          <label class="label">Từ khóa</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" placeholder="Tìm theo tên hoặc mã đợt..." />
          </div>
        </div>

        <div class="filter-item">
          <label class="label">Từ ngày</label>
          <input type="date" class="form-control" />
        </div>

        <div class="filter-item">
          <label class="label">Đến ngày</label>
          <input type="date" class="form-control" />
        </div>
      </div>

      <div class="filter-row mt-3">
        <div class="filter-item">
          <label class="label">Loại giảm giá</label>
          <select class="form-control">
            <option value="">-- Tất cả --</option>
            <option value="0">Theo Phần trăm (%)</option>
            <option value="1">Theo Số tiền (VND)</option>
          </select>
        </div>

        <div class="filter-item">
          <label class="label">Trạng thái</label>
          <select class="form-control">
            <option value="">-- Tất cả --</option>
            <option value="1">Hoạt động</option>
            <option value="0">Ngừng hoạt động</option>
          </select>
        </div>

        <div class="filter-item action-item">
          <label class="label d-none-mobile">&nbsp;</label>
          <div class="btn-group">
            <button class="btn-filter reset">
              <i class="fa-solid fa-rotate-left"></i> <span class="btn-text">Làm mới</span>
            </button>
            <button class="btn-filter search">
              <i class="fa-solid fa-filter"></i> <span class="btn-text">Lọc</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card table-section">
      <div class="table-header">
        <div class="header-left">
          <h3>Danh sách đợt giảm giá</h3>
          <span class="count-badge">0 bản ghi</span>
        </div>

        <button class="btn-add" @click="goToAddPage">
          <i class="fa-solid fa-plus"></i> Thêm mới
        </button>
      </div>

      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th class="text-center" width="50px">STT</th>
              <th>Mã đợt</th>
              <th>Tên đợt</th>
              <th>Loại giảm</th>
              <th class="text-right">Giá trị</th>
              <th class="text-right">Giảm tối đa</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th class="text-center">Ưu tiên</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="discounts.length === 0">
              <td colspan="11" class="empty-row">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" width="60" />
                <p>Chưa có dữ liệu đợt giảm giá</p>
              </td>
            </tr>
            <tr v-for="(item, index) in discounts" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td><strong>{{ item.code }}</strong></td>
              <td>{{ item.name }}</td>
              <td>
                <span class="tag-type" :class="item.typeClass">{{ item.typeName }}</span>
              </td>
              <td class="text-right highlight-text">{{ item.displayValue }}</td>
              <td class="text-right">{{ item.maxDiscount || '-' }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.endDate }}</td>
              <td class="text-center"><span class="badge-priority">{{ item.priority }}</span></td>
              <td class="text-center"><span class="badge" :class="item.statusClass">{{ item.statusText }}</span></td>
              <td class="text-center action-cell">
                <button class="btn-icon view"><i class="fa-regular fa-eye"></i></button>
                <button class="btn-icon edit"><i class="fa-regular fa-pen-to-square"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="page-btn"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="page-btn active">1</button>
        <button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 1. Import useRouter

const router = useRouter(); // 2. Khởi tạo router

// 3. Hàm chuyển trang
const goToAddPage = () => {
  router.push('/discounts/create');
};
const discounts = ref([]);

const fetchDiscounts = async () => {
  try {
    const rawData = [];
    discounts.value = rawData.map(item => {
      // Logic map giữ nguyên...
      return item;
    });
  } catch (error) { console.error(error); }
};

onMounted(() => { fetchDiscounts(); });
</script>

<style scoped>
/* QUAN TRỌNG: Fix lỗi vỡ layout do padding */
* {
  box-sizing: border-box;
}

.discount-page { padding-bottom: 30px; }
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #1e293b; }
.card { background: #fff; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

/* --- BỘ LỌC (GRID SYSTEM FIX) --- */
.filter-row {
  display: flex;
  gap: 20px; /* Khoảng cách giữa các cột */
  flex-wrap: wrap; /* Cho phép xuống dòng trên màn hình nhỏ */
}

.mt-3 { margin-top: 20px; }

/* Cột filter: Mặc định chia đều */
.filter-item {
  flex: 1; /* Co giãn đều nhau */
  min-width: 200px; /* Không cho nhỏ hơn 200px để tránh vỡ */
  display: flex;
  flex-direction: column;
}

/* Ô tìm kiếm chiếm không gian gấp đôi (nếu màn hình đủ rộng) */
.search-item {
  flex: 2;
  min-width: 250px;
}

/* Cột nút bấm */
.action-item {
  flex: 0.8; /* Nhỏ hơn các ô input một chút */
  min-width: 180px;
  justify-content: flex-end; /* Đẩy nút xuống đáy */
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px; /* Tăng khoảng cách label và input */
  display: block;
}

/* Input chung */
.form-control,
.input-wrapper input {
  height: 40px; /* Cố định chiều cao */
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background-color: #fff;
}

.form-control:focus,
.input-wrapper input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Search Wrapper đặc biệt */
.input-wrapper { position: relative; width: 100%; }
.input-wrapper input { padding-left: 36px; } /* Chừa chỗ cho icon */
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
}

/* Nút bấm (Fix chiều cao bằng input) */
.btn-group {
  display: flex;
  gap: 10px;
}

.btn-filter {
  height: 40px; /* BẰNG chiều cao input */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  white-space: nowrap; /* Tránh xuống dòng chữ trong nút */
  padding: 0 15px;
}

.btn-filter.reset { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
.btn-filter.reset:hover { background: #e2e8f0; }

.btn-filter.search { background: #1e293b; color: white; }
.btn-filter.search:hover { background: #0f172a; }

/* Responsive cho màn hình nhỏ */
@media (max-width: 768px) {
  .filter-row { gap: 15px; }
  .filter-item { flex: 100%; min-width: 100%; } /* Mỗi ô 1 dòng */
  .d-none-mobile { display: none; } /* Ẩn label rỗng trên mobile */
}

.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-left { display: flex; align-items: center; gap: 10px; }
.count-badge { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #64748b; }
.btn-add { background: #16a34a; color: white; border: none; padding: 0 20px; height: 40px; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.btn-add:hover { background: #15803d; }

.table-container { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
.custom-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 1000px; }
.custom-table th { background: #f8fafc; color: #475569; font-weight: 600; padding: 14px 12px; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
.custom-table td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #334155; }

.tag-type { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.tag-percent { background: #f3e8ff; color: #7e22ce; }
.tag-money { background: #dcfce7; color: #15803d; }
.highlight-text { font-weight: 600; color: #d63031; }
.badge-priority { display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; background: #e2e8f0; border-radius: 50%; font-weight: bold; font-size: 12px; color: #475569; }
.badge { padding: 6px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.status-active { background: #dcfce7; color: #166534; }
.status-disabled { background: #fee2e2; color: #991b1b; }
.empty-row { text-align: center; padding: 40px !important; color: #94a3b8; }
.empty-row img { margin-bottom: 10px; opacity: 0.5; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.action-cell { white-space: nowrap; }
.btn-icon { width: 32px; height: 32px; border: none; background: transparent; border-radius: 4px; cursor: pointer; color: #94a3b8; transition: 0.2s; }
.btn-icon:hover { background: #f1f5f9; color: #333; }
.btn-icon.view:hover { color: #3b82f6; }
.btn-icon.edit:hover { color: #f59e0b; }
.pagination { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
.page-btn { width: 36px; height: 36px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.page-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.page-btn.active { background: #333; color: white; border-color: #333; }
</style>
