<template>
  <div class="discount-page">
    <div class="header-section">
      <h2 class="page-title">
        QUẢN LÝ ĐỢT GIẢM GIÁ / <span class="title-light">CHI TIẾT & CẬP NHẬT</span>
      </h2>
      <button class="btn-back" @click="router.push({name: 'Discounts'})">
        <i class="fa-solid fa-arrow-left"></i> Quay lại
      </button>
    </div>

    <div class="content-wrapper">
      <div class="left-column">
        <div class="card info-card">
          <h4 class="card-title">Thông tin chung</h4>

          <div class="form-group">
            <label class="label">Mã đợt (Không thể sửa):</label>
            <input v-model="formData.maDotGiamGia" type="text" class="form-control" disabled style="background-color: #f1f5f9;" />
          </div>

          <div class="form-group">
            <label class="label">Tên đợt giảm giá: <span class="text-red">*</span></label>
            <input v-model="formData.tenDotGiamGia" type="text" class="form-control" placeholder="Nhập tên đợt..." :disabled="isEnded" />
          </div>

          <div class="form-group row-group">
            <label class="label" style="min-width: 120px;">Loại giảm giá:</label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" :value="false" v-model="formData.loaiGiamGia" :disabled="isEnded" /> %
              </label>
              <label class="radio-item">
                <input type="radio" :value="true" v-model="formData.loaiGiamGia" :disabled="isEnded" /> VNĐ
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="label">Giá trị giảm:</label>
            <input v-model.number="formData.giaTriGiamGia" type="number" class="form-control" placeholder="Nhập giá trị..." :disabled="isEnded" />
          </div>

          <div class="form-group" v-if="formData.loaiGiamGia === false">
            <label class="label">Giảm tối đa (VNĐ):</label>
            <input v-model.number="formData.soTienGiamToiDa" type="number" class="form-control" placeholder="Nhập số tiền tối đa..." :disabled="isEnded" />
          </div>

          <div class="form-group">
            <label class="label">Ngày bắt đầu:</label>
            <input v-model="formData.ngayBatDau" type="date" class="form-control" :disabled="isEnded" />
          </div>

          <div class="form-group">
            <label class="label">Ngày kết thúc:</label>
            <input v-model="formData.ngayKetThuc" type="date" class="form-control" :disabled="isEnded" />
          </div>

          <div class="action-buttons mt-4">
            <button class="btn-update" @click="submitUpdate" v-if="!isEnded">
                <i class="fa-solid fa-floppy-disk me-1"></i> Lưu thay đổi
            </button>
            <button class="btn-delete ms-2" @click="softDelete">
                <i class="fa-solid fa-trash me-1"></i> Xóa
            </button>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="card product-select-card">
          <h4 class="card-title">Chọn sản phẩm áp dụng</h4>
          <div class="search-bar mb-3">
            <div class="input-wrapper">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input v-model="searchKeyword" type="text" placeholder="Tìm theo tên hoặc mã sản phẩm..." />
            </div>
          </div>

          <div class="table-wrapper-mini">
            <table class="custom-table">
              <colgroup>
                 <col style="width: 50px;">
                 <col style="width: 150px;">
                 <col>
              </colgroup>
              <thead>
                <tr>
                  <th class="text-center">#</th>
                  <th class="text-center">Mã SP</th>
                  <th class="text-center">Tên sản phẩm</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredParentProducts.length === 0">
                  <td colspan="3" class="text-center text-muted py-4">Không tìm thấy dữ liệu</td>
                </tr>
                <tr v-for="group in paginatedParentProducts" :key="group.idSanPham">
                  <td class="text-center">
                    <input
                      type="checkbox"
                      class="custom-checkbox"
                      :checked="isGroupSelected(group.idSanPham)"
                      @change="handleParentCheck(group.idSanPham, $event.target.checked)"
                      :disabled="isEnded"
                    />
                  </td>
                  <td class="text-center">{{ group.maSanPham }}</td>
                  <td class="font-weight-bold text-center">{{ group.tenSanPham }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination" v-if="totalPages > 0">
            <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="page-btn active">{{ currentPage }}</button>
            <button class="page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="card detail-card">
        <div class="detail-header">
          <h3 class="section-title">Danh sách chi tiết sản phẩm được áp dụng
            <span v-if="selectedVariantIds.length" class="count-tag">({{ selectedVariantIds.length }})</span>
          </h3>
          <button class="btn-danger-outline" @click="removeAll" v-if="selectedVariantIds.length > 0 && !isEnded">
             <i class="fa-solid fa-trash"></i> Xóa tất cả
          </button>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th width="40" class="text-center">
                  <input type="checkbox" class="custom-checkbox" @change="toggleAllVariants" :checked="isAllVariantsSelected" :disabled="isEnded"/>
                </th>
                <th class="text-center" width="50">STT</th>
                <th>Mã SP (CT)</th>
                <th class="text-center">Tên sản phẩm</th>
                <th class="text-center">Thương hiệu</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Chất liệu</th>
                <th class="text-center">Kích cỡ</th>
                <th class="text-center">Màu sắc</th>
                <th class="text-center">Đế giày</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="variantsDisplay.length === 0">
                 <td colspan="10" class="text-center text-muted py-5">
                    <div class="empty-state">
                        <i class="fa-solid fa-box-open fa-2x mb-2"></i>
                        <p>Chưa có sản phẩm nào được chọn cho đợt giảm giá này.</p>
                    </div>
                 </td>
              </tr>
              <tr v-for="(item, index) in paginatedVariantsDisplay" :key="item.id">
                <td class="text-center">
                  <input type="checkbox" class="custom-checkbox" :value="item.id" v-model="selectedVariantIds" :disabled="isEnded">
                </td>
                <td class="text-center">{{ (currentDetailPage - 1) * detailItemsPerPage + index + 1 }}</td>
                <td class="font-weight-bold text-primary">{{ item.maChiTietSanPham }}</td>
                <td class="text-wrap-name text-center">{{ item.tenSanPham }}</td>
                <td class="text-center">{{ item.tenThuongHieu }}</td>
                <td class="text-center">{{ item.soLuong }}</td>
                <td class="text-center">{{ item.tenChatLieu }}</td>
                <td class="text-center font-weight-bold">{{ item.tenKichThuoc }}</td>
                <td class="text-center">
                   <span class="color-dot" :style="{backgroundColor: mapColor(item.tenMauSac)}"></span>
                   {{ item.tenMauSac }}
                </td>
                <td class="text-center">{{ item.tenLoaiSan }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" v-if="totalDetailPages > 0">
            <button class="page-btn" @click="changeDetailPage(currentDetailPage - 1)" :disabled="currentDetailPage === 1"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="page-btn active">{{ currentDetailPage }}</button>
            <button class="page-btn" @click="changeDetailPage(currentDetailPage + 1)" :disabled="currentDetailPage === totalDetailPages"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { discountService } from '@/service/DiscountService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const discountId = route.params.id; // Lấy ID từ URL

// --- STATE ---
const formData = reactive({
  maDotGiamGia: '',
  tenDotGiamGia: '',
  loaiGiamGia: false, // false: %, true: VND
  giaTriGiamGia: null,
  soTienGiamToiDa: null,
  ngayBatDau: '',
  ngayKetThuc: '',
  trangThai: true
});

const currentPage = ref(1);
const itemsPerPage = 5;
const rawVariants = ref([]);
const selectedVariantIds = ref([]);
const searchKeyword = ref('');
const isLoading = ref(false);
const currentDetailPage = ref(1);
const detailItemsPerPage = 5;

// --- COMPUTED (Tái sử dụng từ trang Create) ---
const productGroups = computed(() => {
  const groups = {};
  rawVariants.value.forEach(v => {
    const pId = v.idSanPham;
    if (!groups[pId]) {
      groups[pId] = {
        idSanPham: pId,
        tenSanPham: v.tenSanPham,
        maSanPham: v.maSanPham || `SP-${pId}`,
        variants: []
      };
    }
    groups[pId].variants.push(v);
  });
  return Object.values(groups);
});

const filteredParentProducts = computed(() => {
  if (!searchKeyword.value) return productGroups.value;
  const key = searchKeyword.value.toLowerCase();
  return productGroups.value.filter(g =>
    g.tenSanPham.toLowerCase().includes(key) ||
    g.maSanPham.toLowerCase().includes(key)
  );
});

const totalPages = computed(() => Math.ceil(filteredParentProducts.value.length / itemsPerPage));

const paginatedParentProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredParentProducts.value.slice(start, end);
});

const isEnded = computed(() => {
  if (!formData.ngayKetThuc) return false;
  // Parse ngày kết thúc (YYYY-MM-DD) thành Date object local
  const parts = formData.ngayKetThuc.split('-');
  if (parts.length !== 3) return false;
  const end = new Date(parts[0], parts[1] - 1, parts[2]);
  end.setHours(23, 59, 59, 999); // Tính đến hết ngày
  return new Date() > end;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

watch(searchKeyword, () => { currentPage.value = 1; });

const variantsDisplay = computed(() => {
  return rawVariants.value.filter(v => selectedVariantIds.value.includes(v.id));
});

const totalDetailPages = computed(() => Math.ceil(variantsDisplay.value.length / detailItemsPerPage));

const paginatedVariantsDisplay = computed(() => {
  const start = (currentDetailPage.value - 1) * detailItemsPerPage;
  const end = start + detailItemsPerPage;
  return variantsDisplay.value.slice(start, end);
});

const changeDetailPage = (page) => {
  if (page >= 1 && page <= totalDetailPages.value) currentDetailPage.value = page;
};

// Watch variantsDisplay để reset trang chi tiết nếu số lượng thay đổi
watch(() => variantsDisplay.value.length, () => {
  if (currentDetailPage.value > totalDetailPages.value) {
    currentDetailPage.value = Math.max(1, totalDetailPages.value);
  }
});

const isAllVariantsSelected = computed(() => {
   return variantsDisplay.value.length > 0 &&
          variantsDisplay.value.every(v => selectedVariantIds.value.includes(v.id));
});

// --- METHODS ---

// Helper: Format Date 'yyyy-MM-dd' cho input type="date"
const formatDateForInput = (dateInput) => {
    if (!dateInput) return '';
    // Trường hợp 1: Array [2024, 1, 15]
    if (Array.isArray(dateInput)) {
        const [y, m, d] = dateInput;
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    // Trường hợp 2: String "2024-01-15T00:00:00"
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

const loadData = async () => {
  isLoading.value = true;
  try {
    // 1. Load tất cả biến thể sản phẩm trước để có data map
    rawVariants.value = await discountService.getAllProductDetails();

    // 2. Load thông tin đợt giảm giá
    const discountInfo = await discountService.getOne(discountId);
    if (discountInfo) {
        Object.assign(formData, discountInfo);
        // Format lại ngày tháng để hiển thị đúng trên input type="date"
        formData.ngayBatDau = formatDateForInput(discountInfo.ngayBatDau);
        formData.ngayKetThuc = formatDateForInput(discountInfo.ngayKetThuc);
    }

    // 3. Load danh sách chi tiết đã áp dụng (lấy ID để map vào selectedVariantIds)
    const appliedDetails = await discountService.getDiscountDetails(discountId);
    if (appliedDetails && appliedDetails.length > 0) {
        // Giả định API trả về mảng object có chứa idChiTietSanPham
        selectedVariantIds.value = appliedDetails.map(item => item.idChiTietSanPham);
    }

  } catch (e) {
    console.error("Lỗi tải dữ liệu chi tiết: ", e);
    alert("Không thể tải dữ liệu đợt giảm giá.");
  } finally {
    isLoading.value = false;
  }
};

const isGroupSelected = (parentId) => {
  const group = productGroups.value.find(g => g.idSanPham === parentId);
  if (!group) return false;
  return group.variants.length > 0 && group.variants.every(v => selectedVariantIds.value.includes(v.id));
};

const handleParentCheck = (parentId, isChecked) => {
  const group = productGroups.value.find(g => g.idSanPham === parentId);
  if (!group) return;
  const childIds = group.variants.map(v => v.id);

  if (isChecked) {
    selectedVariantIds.value = [...new Set([...selectedVariantIds.value, ...childIds])];
  } else {
    selectedVariantIds.value = selectedVariantIds.value.filter(id => !childIds.includes(id));
  }
};

const toggleAllVariants = (e) => {
  if (e.target.checked) {
     selectedVariantIds.value = []; // Hoặc logic select all trang hiện tại
  }
};

const removeAll = () => {
    if(confirm('Bạn có chắc muốn bỏ chọn tất cả sản phẩm?')) {
        selectedVariantIds.value = [];
    }
};

const submitUpdate = async () => {
  if (!formData.tenDotGiamGia || !formData.ngayBatDau || !formData.ngayKetThuc) {
    alert("Vui lòng nhập đủ thông tin đợt giảm giá");
    return;
  }

  if (selectedVariantIds.value.length === 0) {
      if(!confirm("Đợt giảm giá này chưa chọn sản phẩm nào. Bạn có chắc muốn lưu không?")) return;
  }

  // Payload gửi đi bao gồm Info + List ID sản phẩm
  const payload = {
      ...formData,
      idChiTietSanPhams: selectedVariantIds.value
  };

  try {
    isLoading.value = true;
    await discountService.update(discountId, payload);
    alert("Cập nhật thành công!");
    router.push({ name: 'Discounts' }); // Quay lại trang danh sách (tên route trong router của bạn)
  } catch (e) {
    alert("Lỗi cập nhật: " + (e.response?.data?.message || e.message));
  } finally {
    isLoading.value = false;
  }
};

const softDelete = async () => {
  if (!confirm("Bạn có chắc muốn xóa đợt giảm giá này?")) return;

  try {
    isLoading.value = true;
    // Gọi hàm delete để kích hoạt logic xóa mềm (setXoaMem = true) ở Backend
    await discountService.delete(discountId);
    alert("Đã xóa thành công!");
    router.push({ name: 'Discounts' });
  } catch (e) {
    alert("Lỗi xóa: " + (e.response?.data?.message || e.message));
  } finally {
    isLoading.value = false;
  }
};

// Map màu sắc
const mapColor = (colorName) => {
    if (!colorName) return '#ccc';
    const lower = colorName.toLowerCase();
    if (lower.includes('đỏ')) return '#ef4444';
    if (lower.includes('xanh lá') || lower.includes('lục')) return '#22c55e';
    if (lower.includes('xanh dương') || lower.includes('xanh')) return '#3b82f6';
    if (lower.includes('đen')) return '#000';
    if (lower.includes('trắng')) return '#f8fafc';
    if (lower.includes('vàng')) return '#eab308';
    if (lower.includes('cam')) return '#f97316';
    if (lower.includes('tím')) return '#a855f7';
    if (lower.includes('hồng')) return '#ec4899';
    if (lower.includes('xám') || lower.includes('ghi')) return '#64748b';
    if (lower.includes('nâu')) return '#78350f';
    return '#ccc';
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* { box-sizing: border-box; }
.discount-page { padding-bottom: 30px; font-family: 'Inter', 'Segoe UI', sans-serif; }

.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; margin-top: 10px; }
.page-title { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0; }
.btn-back { background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
.btn-back:hover { background: #475569; }

.title-light { font-weight: 400; color: #64748b; }

.content-wrapper { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-bottom: 24px; }
.card { background: #fff; border-radius: 10px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: none; display: flex; flex-direction: column; }
.card-title { font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }

.left-column, .right-column { min-width: 0; display: flex; flex-direction: column; }
.info-card, .product-select-card { height: 100%; }

/* Form Styles */
.form-group { margin-bottom: 16px; }
.label { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; display: block; }
.text-red { color: #ef4444; }
.form-control { width: 100%; height: 40px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none; transition: 0.2s; }
.form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

.radio-group { display: flex; gap: 20px; }
.radio-item { display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer; }

/* Buttons */
.action-buttons { display: flex; gap: 10px; margin-top: auto; justify-content: center; }
.btn-update { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; transition: 0.2s; flex: 1; justify-content: center; }
.btn-update:hover { background: #2563eb; }
.btn-delete { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; transition: 0.2s; flex: 1; justify-content: center; }
.btn-delete:hover { background: #dc2626; }

.btn-danger-outline { background: transparent; border: 1px solid #ef4444; color: #ef4444; border-radius: 4px; padding: 4px 10px; font-size: 12px; cursor: pointer; transition: 0.2s; }
.btn-danger-outline:hover { background: #fef2f2; }

/* Table Mini & Search */
.search-bar { margin-bottom: 16px; }
.input-wrapper { position: relative; width: 100%; }
.input-wrapper input { padding-left: 36px; width: 100%; height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; outline: none; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.table-wrapper-mini { height: 450px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; }

/* Pagination Mini */
.pagination { display: flex; justify-content: center; gap: 8px; margin-top: auto; padding-top: 16px; }
.page-btn { width: 32px; height: 32px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #64748b; }
.page-btn:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
.page-btn.active { background: #1e293b; color: white; border-color: #1e293b; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Table General */
.table-responsive { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
.custom-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.custom-table th { background: #f8fafc; color: #475569; font-weight: 600; padding: 12px; border-bottom: 1px solid #e2e8f0; white-space: nowrap; position: sticky; top: 0; z-index: 10; }
.custom-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #334155; }
.custom-table tr:hover td { background-color: #f8fafc; }

/* Detail Section */
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
.count-tag { background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 8px; }

/* Utilities */
.text-center { text-align: center; }
.font-weight-bold { font-weight: 600; }
.text-primary { color: #2563eb; }
.text-muted { color: #94a3b8; }
.color-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; border: 1px solid #cbd5e1; }
.custom-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: #16a34a; }
.empty-state { text-align: center; color: #cbd5e1; padding: 20px; }
.empty-state p { font-size: 14px; color: #94a3b8; margin-top: 5px; }

@media (max-width: 1024px) {
  .content-wrapper { grid-template-columns: 1fr; }
}
</style>
