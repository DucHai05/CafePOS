import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { orderApi } from '../../api/orderAPI';
import { promoApi } from '../../api/promotionAPI';
import { tableApi } from '../../api/tableAPI';
import { doanhthuApi } from '../../api/doanhthuAPI'; 
import PhanLoaiCard from '../../components/Common/PhanLoaiCard'; // Import component dùng chung
import CategoryTab from '../../components/Common/CategoryTab';
import KitchenSlipModal from '../../components/Common/KitchenSlipModal';
import ReceiptModal from '../../components/Common/ReceiptModal';
import CartFooter from '../../components/Common/CartFooter';
import PromotionModal from '../../components/Common/PromotionModal';
import NoteModal from '../../components/Common/NoteModal';
import CartList from '../../components/Common/CartList';
import OrderDropdown from '../../components/Common/OrderDropdown';
import ConfirmDeleteModal from '../../components/Common/ConfirmDeleteModal';
import * as CartHelpers from '../../utils/cartHelpers';

const PaymentPage = () => {

    // Lấy maCa trường hợp bỏ qua bước "xác nhận"
        const [maCaOpen, setMaCaOpen] = useState('');
        useEffect(() => {
            const fetchMaCa = async () => {
                try {
                    const response = await doanhthuApi.getMaCaDangMo();
                    console.log("Mã ca đang mở:", response.data);
                    setMaCaOpen(response.data); // Gán mã ca vào biến
                } catch (error) {
                    console.error("Không lấy được mã ca:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMaCa();
        }, []);
        
        // Tìm hóa đơn chưa thanh toán của bàn này
        useEffect(() => {
                const fetchCurrentOrder = async () => {
                    try {
                        // Gọi API tìm hóa đơn chưa thanh toán của bàn này
                        const res = await orderApi.loadBan(maBan);
                        if (res.data) {
                            setCurrentOrderId(res.data.maHoaDon); // Lưu ID hóa đơn hiện tại
                            setOrderedItems(res.data.items);     // (Tùy chọn) Hiển thị các món cũ cho nhân viên xem
                        }
                    } catch (err) {
                        console.log("Bàn trống hoặc chưa có hóa đơn cũ");
                        setCurrentOrderId(null);
                    }
                };
                fetchCurrentOrder();
            }, [maBan]);

        // Hàm thanh toán 
     const handlePaymentConfirm = async (method) => {
        console.log(">>> Bắt đầu luồng thanh toán SIÊU TỐC...");
    
        // 1. CHẶN LỖI: Kiểm tra xem đã lấy được mã ca chưa
        if (!maCaOpen || maCaOpen === "NONE" || maCaOpen === "undefined") {
            alert("⚠️ Lỗi: Chưa lấy được mã ca làm việc. Vui lòng chờ 1 giây hoặc tải lại trang!");
            return;
        }
    
        try {
            // 2. CHUẨN BỊ orderData (Đảm bảo có maCa)
            const orderData = {
                maHoaDon: maHoaDon, 
                maBan: maBan,
                maCa: maCaOpen, // <--- Cực kỳ quan trọng
                items: cart.map(item => ({
                    maSanPham: item.maSanPham,
                    soLuong: item.soLuong,
                    giaBan: item.giaBan,
                    ghiChu: item.ghiChu || ""
                })),
                tongTien: totalAmount
            };
    
            // 3. BƯỚC ĐỆM: Lưu/Cập nhật hóa đơn trước khi chốt tiền
            // Việc này đảm bảo maCa được ghi vào bảng HoaDon ở port 8081
            console.log(">>> Đang lưu hóa đơn với mã ca:", maCaOpen);
            const createRes = await orderApi.staffCreate(orderData);
            
            // Lấy mã HD chính xác từ server trả về
            const currentMaHD = createRes.data.hoaDon ? createRes.data.hoaDon.maHoaDon : createRes.data.maHoaDon;
            setMaHoaDon(currentMaHD);
    
            // 4. CHỐT THANH TOÁN (Hóa đơn sang trạng thái PAID)
            const paymentPayload = {
                maHoaDon: currentMaHD,
                maBan: maBan,
                phuongThucThanhToan: method,
                maKhuyenMai: manualDiscount?.maKhuyenMai || autoDiscount?.maKhuyenMai || null,
                tongTienSauKM: totalAmount,
                thoiGianThanhToan: new Date().toISOString(),
                trangThaiThanhToan: 'Paid',
                tongTienGoc: subTotal,
                nhanVienThucHien: 'Hải POS'
            };
    
            console.log(">>> Đang gửi lệnh chốt thanh toán...");
            const payRes = await orderApi.finalPayment(paymentPayload);
    
            // 5. CẬP NHẬT DOANH THU (Service 8084)
            // Dùng biến maCaOpen trực tiếp để chắc chắn không bị undefined
            console.log(">>> Đang cộng tiền vào doanh thu ca:", maCaOpen);
            await doanhthuApi.updateAfterPayment(maCaOpen, method, totalAmount);
    
            if (payRes.status === 200 || payRes.status === 201) {
                // 6. GIẢI PHÓNG BÀN (Màu xanh)
                await tableApi.updateTrangThai(maBan, 'PAID');
                
                alert(`Thanh toán SIÊU TỐC thành công! Mã đơn: ${currentMaHD}`);
                
                setIsReceiptOpen(false);
                setCart([]);
                navigate('/sell');
            }
    
        } catch (err) {
            console.error(">>> LỖI COMBO THANH TOÁN:", err);
            const errorMsg = err.response?.data?.message || "Lỗi hệ thống khi xử lý thanh toán!";
            alert("Thanh toán thất bại: " + errorMsg);
        }
        };
};
export default PaymentPage;