import axios from 'axios';

const BASE_URL = 'http://localhost:8084/api/doanhthu';
const BASE_URL_2 = 'http://localhost:8084/api/ca';

export const doanhthuApi = {
    // Lấy MaCa đang mở
    getMaCaDangMo: (maCa) => axios.get(`${BASE_URL_2}/getMaCaDangMo`),
};