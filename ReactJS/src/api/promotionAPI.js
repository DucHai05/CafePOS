import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/promotions';

export const promoApi = {
    // Lấy danh sách khuyến mãi đang hoạt động
    getActivePromos: () => axios.get(`${BASE_URL}/active`)
};