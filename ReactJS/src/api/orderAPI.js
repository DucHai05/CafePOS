import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/orders';
const PAYMENT_URL = 'http://localhost:8081/api/payments';

export const orderApi = {
    // Lấy danh sách sản phẩm
    getProducts: () => axios.get(`${BASE_URL}/getProducts`),

    // Lấy thông tin hóa đơn hiện tại của bàn
    loadBan: (maBan) => axios.get(`${BASE_URL}/loadBan/${maBan}`),

    // Tạo đơn hàng mới (Xuống bếp)
    staffCreate: (orderData) => axios.post(`${BASE_URL}/staff-create`, orderData),

    // Chốt thanh toán cuối cùng
    finalPayment: (paymentPayload) => axios.post(`${PAYMENT_URL}/final-payment`, paymentPayload),

    // API này sẽ gọi đến Backend để cộng dồn món vào hóa đơn cũ
    addItems: (data) => axios.put(`${BASE_URL}/add-items`, data),
    
    // API lấy hóa đơn hiện tại của bàn
    removeOrderItem: (maChiTietHD) => axios.delete(`${BASE_URL}/remove-item/${maChiTietHD}`)
};