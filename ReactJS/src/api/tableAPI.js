import axios from 'axios';

const BASE_URL = 'http://localhost:8083/api/ban';
const KHUVUC_URL = 'http://localhost:8083/api/khuvuc';

export const tableApi = {
    // Lấy danh sách sản phẩm
    getTables: () => axios.get(`${BASE_URL}`),

    // Lấy danh sách khu vực
    getKhuVuc: () => axios.get(`${KHUVUC_URL}`),

    updateTrangThai: (maBan, status = 'Pending') => 
        axios.put(`${BASE_URL}/updateTrangThai/${maBan}?status=${status}`),

    getBanTrong: (maBan) => axios.get(`${BASE_URL}/ban-trong/${maBan}`)
    // Tạo đơn hàng mới (Xuống bếp)
   // staffCreate: (orderData) => axios.post(`${BASE_URL}/staff-create`, orderData),

    // Chốt thanh toán cuối cùng
   // finalPayment: (paymentPayload) => axios.post(`${PAYMENT_URL}/final-payment`, paymentPayload)
};