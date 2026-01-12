<template>
  <div class="add-discount-page">
    <div class="page-header">
      <h2 class="page-title">ĐỢT GIẢM GIÁ / THÊM ĐỢT GIẢM GIÁ</h2>
    </div>

    <div class="top-section">

      <div class="card form-card">
        <div class="form-group">
          <label>Mã đợt giảm giá:</label>
          <input type="text" class="form-control" placeholder="DGG-12" disabled />
        </div>

        <div class="form-group">
          <label>Tên đợt giảm giá:</label>
          <input type="text" class="form-control" placeholder="Nhập tên đợt..." />
        </div>

        <div class="form-group">
          <label>Loại giảm giá:</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="type" value="percent" checked /> %
            </label>
            <label class="radio-item">
              <input type="radio" name="type" value="money" /> VNĐ
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Giá trị giảm giá:</label>
          <input type="number" class="form-control" placeholder="0" />
        </div>

        <div class="form-group">
          <label>Ngày bắt đầu:</label>
          <input type="datetime-local" class="form-control" />
        </div>

        <div class="form-group">
          <label>Ngày kết thúc:</label>
          <input type="datetime-local" class="form-control" />
        </div>
      </div>

      <div class="card product-select-card">
        <div class="search-box">
          <input type="text" placeholder="Tìm theo tên ..." />
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
        </div>

        <table class="mini-table">
          <thead>
            <tr>
              <th width="30"></th>
              <th>Mã sản phẩm</th>
              <th>Tên sản phẩm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 4" :key="i">
              <td><input type="checkbox" /></td>
              <td>P-0000000{{ i }}</td>
              <td>Giày thể thao mẫu {{ i }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination-mini">
           <button class="page-btn-mini">&lt;</button>
           <button class="page-btn-mini active">1</button>
           <button class="page-btn-mini">&gt;</button>
        </div>
      </div>
    </div>

    <div class="card detail-card">
      <div class="detail-header">
        <h3>Chi Tiết Sản Phẩm</h3>
        <button class="btn-create">Tạo mới</button>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th><input type="checkbox"></th>
              <th>STT</th>
              <th>Mã sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Số lượng</th>
              <th>Chất liệu</th>
              <th>Kích cỡ</th>
              <th>Màu sắc</th>
              <th>Đế giày</th>
            </tr>
          </thead>
          <tbody>
             <tr>
              <td><input type="checkbox" checked></td>
              <td>1</td>
              <td>P-0000001</td>
              <td>Firm Ground Predator Elite</td>
              <td>Giày đá bóng</td>
              <td>Adidas</td>
              <td>100</td>
              <td>Chất liệu tổng hợp</td>
              <td>43</td>
              <td>Đỏ hồng</td>
              <td>Đế nhựa TPU</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Logic xử lý form sẽ viết ở đây
</script>

<style scoped>
.add-discount-page { padding-bottom: 30px; }
.page-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; color: #333; }

/* Layout 2 cột */
.top-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-card { flex: 0.8; } /* Cột trái nhỏ hơn chút */
.product-select-card { flex: 1.2; display: flex; flex-direction: column; }

/* Form Styles */
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 5px; }
.form-control { width: 95%; height: 38px; border: 1px solid #e5e7eb; border-radius: 5px; padding: 0 10px; outline: none; }
.form-control:disabled { background: #f3f4f6; }

.radio-group { display: flex; gap: 20px; margin-top: 5px; }
.radio-item { display: flex; align-items: center; gap: 5px; cursor: pointer; }

/* Search Box bên phải */
.search-box { position: relative; margin-bottom: 15px; }
/* Tìm đến đoạn CSS .search-box input và thay thế bằng đoạn dưới đây */

.search-box input {
  width: 100%;
  height: 38px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 0 40px 0 15px; /* Padding phải rộng hơn để tránh chữ đè icon */
  outline: none;
  box-sizing: border-box; /* QUAN TRỌNG: Giúp padding không làm tăng kích thước width */
}.search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #999; }

/* Mini Table (Bên phải) */
.mini-table { width: 100%; font-size: 13px; border-collapse: collapse; }
.mini-table th { background: #e5e7eb; padding: 8px; text-align: left; font-weight: 600; }
.mini-table td { border-bottom: 1px solid #f3f4f6; padding: 8px; }

.pagination-mini { display: flex; justify-content: center; gap: 5px; margin-top: auto; padding-top: 10px;}
.page-btn-mini { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; }
.page-btn-mini.active { background: #333; color: white; border-color: #333; }

/* Bottom Detail Section */
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.btn-create { background: #3b82f6; color: white; border: none; padding: 8px 20px; border-radius: 5px; font-weight: 600; cursor: pointer; }
.btn-create:hover { background: #2563eb; }

.custom-table { width: 100%; border-collapse: collapse; font-size: 13px; white-space: nowrap; }
.custom-table th { background: #f9fafb; padding: 12px; text-align: left; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
.custom-table td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
.table-responsive { overflow-x: auto; }
</style>
