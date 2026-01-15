const BASE_URL = "http://localhost:8080/api/admin";

// Định nghĩa các API endpoint
const API = {
    DISCOUNT: `${BASE_URL}/dot-giam-gia`,
    DISCOUNT_DETAIL: `${BASE_URL}/chi-tiet-dot-giam-gia`,
    PRODUCT_DETAIL: `${BASE_URL}/chi-tiet-san-pham`,
    PRODUCT: `${BASE_URL}/san-pham`,
    COLOR: `${BASE_URL}/mau-sac`,
    SIZE: `${BASE_URL}/kich-thuoc`,
    BRAND: `${BASE_URL}/thuong-hieu`,
    MATERIAL: `${BASE_URL}/chat-lieu`,
    CATEGORY: `${BASE_URL}/loai-san`,
    SOLE: `${BASE_URL}/co-giay`
};

/**
 * Helper: Hàm xử lý Fetch chung để giảm lặp code
 * - Tự động thêm Content-Type json
 * - Tự động parse JSON
 * - Tự động ném lỗi nếu status không phải 2xx
 */
const fetchClient = async (url, options = {}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        // Cố gắng đọc lỗi từ server trả về nếu có
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch { /* Ignore json parse error on error response */ }

        throw new Error(errorMessage);
    }

    // Nếu server trả về 204 No Content thì return null
    if (response.status === 204) return null;

    // Xử lý trường hợp 200 OK nhưng body rỗng (thường gặp với void method của Spring Boot)
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
};

export const discountService = {

    async getAll() {
        return await fetchClient(API.DISCOUNT);
    },

    async getOne(id) {
        return await fetchClient(`${API.DISCOUNT}/${id}`);
    },

    async delete(id) {
        // DELETE thường không cần trả về json body, nhưng fetchClient đã handle
        return await fetchClient(`${API.DISCOUNT}/${id}`, { method: 'DELETE' });
    },

    async update(id, payload) {
        return await fetchClient(`${API.DISCOUNT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    },

    // Lấy danh sách chi tiết sản phẩm thuộc đợt giảm giá
    async getDiscountDetails(idDotGiamGia) {
        // Tạo query param bằng URLSearchParams
        const params = new URLSearchParams({ idDotGiamGia: idDotGiamGia });
        const url = `${API.DISCOUNT_DETAIL}?${params.toString()}`;

        const data = await fetchClient(url);
        return data || [];
    },

    /**
     * 🟢 QUAN TRỌNG: Lấy dữ liệu thật và MAP tên vào ID
     * Sử dụng Promise.all với Fetch
     */
    async getAllProductDetails() {
        try {
            // 1. Gọi song song tất cả các API
            // Lưu ý: fetchClient đã bao gồm bước .json()
            const [
                ctspData,
                spData,
                mauSacData,
                kichThuocData,
                thuongHieuData,
                chatLieuData,
                loaiSanData
            ] = await Promise.all([
                fetchClient(API.PRODUCT_DETAIL),
                fetchClient(API.PRODUCT),
                fetchClient(API.COLOR),
                fetchClient(API.SIZE),
                fetchClient(API.BRAND),
                fetchClient(API.MATERIAL),
                fetchClient(API.CATEGORY)
            ]);

            // Helper: Lấy data an toàn (Fetch trả về data trực tiếp, không bọc trong .data như axios)
            const safeData = (data) => (Array.isArray(data) ? data : []);

            // 2. Tạo Map (Dictionary)
            const createMap = (arr, nameField) => {
                return (arr || []).reduce((acc, item) => {
                    acc[item.id] = item[nameField];
                    return acc;
                }, {});
            };

            // Map ID -> Tên
            const sanPhamNameMap = createMap(safeData(spData), 'tenSanPham');
            const mauSacMap = createMap(safeData(mauSacData), 'tenMauSac');
            const kichThuocMap = createMap(safeData(kichThuocData), 'tenKichThuoc');
            const thuongHieuMap = createMap(safeData(thuongHieuData), 'tenThuongHieu');
            const chatLieuMap = createMap(safeData(chatLieuData), 'tenChatLieu');
            const loaiSanMap = createMap(safeData(loaiSanData), 'tenLoaiSan');

            // 3. Duyệt và enrich data
            const enrichedData = safeData(ctspData).map(item => {
                const parentProduct = safeData(spData).find(p => p.id === item.idSanPham) || {};

                const brandName = thuongHieuMap[parentProduct.idThuongHieu] || 'Chưa cập nhật';
                const materialName = chatLieuMap[parentProduct.idChatLieu] || 'Chưa cập nhật';

                return {
                    ...item,
                    maSanPham: parentProduct.maSanPham || 'SP-UNKNOWN',
                    tenSanPham: sanPhamNameMap[item.idSanPham] || 'Sản phẩm lỗi',
                    tenMauSac: mauSacMap[item.idMauSac] || 'Không xác định',
                    tenKichThuoc: kichThuocMap[item.idKichThuoc] || 'FS',
                    tenLoaiSan: loaiSanMap[item.idLoaiSan] || 'Đế thường',
                    tenThuongHieu: brandName,
                    tenChatLieu: materialName,
                    maChiTietSanPham: item.maChiTietSanPham || `CTSP-${item.id}`
                };
            });

            return enrichedData;

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu sản phẩm từ DB:", error);
            return [];
        }
    },

    /**
     * LOGIC TRANSACTION CLIENT
     */
    async createDiscountComposite(payload) {
        const { idChiTietSanPhams, ...discountData } = payload;

        // Bước 1: Tạo đợt
        const newDiscount = await fetchClient(API.DISCOUNT, {
            method: 'POST',
            body: JSON.stringify(discountData)
        });

        const newDiscountId = newDiscount.id;
        if (!newDiscountId) throw new Error("Lỗi: Không tạo được đợt giảm giá (Không có ID trả về)");

        // Bước 2: Tạo chi tiết
        if (idChiTietSanPhams && idChiTietSanPhams.length > 0) {
            const detailRequests = idChiTietSanPhams.map(idCTSP => {
                const detailPayload = {
                    idDotGiamGia: newDiscountId,
                    idChiTietSanPham: idCTSP,
                    soLuongApDung: null,
                    giaTriGiamRieng: null,
                    soTienGiamToiDaRieng: null,
                    ghiChu: "Added via Admin UI",
                    trangThai: true
                };

                return fetchClient(API.DISCOUNT_DETAIL, {
                    method: 'POST',
                    body: JSON.stringify(detailPayload)
                });
            });

            await Promise.all(detailRequests);
        }

        return newDiscount;
    }
};
