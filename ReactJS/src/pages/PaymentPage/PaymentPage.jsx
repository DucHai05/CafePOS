import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { orderApi } from '../../api/orderAPI';
import { doanhthuApi } from '../../api/doanhthuAPI';
import { tableApi } from '../../api/tableAPI';
import ReceiptModal from '../../components/Common/ReceiptModal';
import './PaymentPage.css';

const PaymentPage = () => {
    const { maBan } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Khai báo dữ liệu từ state (OrderPage truyền sang)
    const {
        maHoaDon: maHDTuState,
        cart: cartTuState,
        maCaOpen: maCaTuState,
        totalAmount: totalTuState,
        subTotal: subTotalTuState,
        manualDiscount,
        autoDiscount
    } = location.state || {};

    const [order, setOrder] = useState(null);
    const [maCaOpen, setMaCaOpen] = useState(maCaTuState || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initPage = async () => {
            try {
                setLoading(true);
                // A. Đảm bảo có Mã Ca (Port 8084)
                if (!maCaOpen) {
                    const caRes = await doanhthuApi.getMaCaDangMo();
                    setMaCaOpen(caRes.data.maCa || caRes.data);
                }

                // B. Lấy thông tin Hóa đơn (Port 8081) để đối soát
                const orderRes = await orderApi.loadBan(maBan);
                if (orderRes.data) {
                    setOrder(orderRes.data);
                }
            } catch (err) {
                console.error("Lỗi khởi tạo thanh toán:", err);
            } finally {
                setLoading(false);
            }
        };
        initPage();
    }, [maBan, maCaOpen]);

    const handleConfirmPayment = async (method) => {
        if (!maCaOpen || maCaOpen === 'NONE') {
            alert("⚠️ Không xác định được ca làm việc!");
            return;
        }

        try {
            // ƯU TIÊN dữ liệu từ State (vì đây là thứ nhân viên vừa thấy ở OrderPage)
            const finalMaHD = maHDTuState || order?.maHoaDon;
            const finalAmount = totalTuState || order?.tongTien; 
            const finalSubTotal = subTotalTuState || order?.tongTienGoc || 0;

            const paymentPayload = {
                maHoaDon: finalMaHD, // Nếu null, Backend hiểu là đơn mới cần INSERT
                maBan: maBan,
                maCa: maCaOpen,
                phuongThucThanhToan: method,
                maKhuyenMai: manualDiscount?.maKhuyenMai || autoDiscount?.maKhuyenMai || null,
                tongTienSauKM: finalAmount,
                tongTienGoc: finalSubTotal,
                thoiGianThanhToan: new Date().toISOString(),
                trangThaiThanhToan: 'Paid',
                nhanVienThucHien: 'DucHaii',
                
                // QUAN TRỌNG: Gửi kèm list món để Backend xử lý nếu chưa có MaHD
                items: cartTuState || order?.items || []
            };

            console.log("🚀 Gửi yêu cầu Thanh toán & Lên đơn:", paymentPayload);

            // 1. Thực hiện API Thanh toán (Backend sẽ check: Nếu MaHD null thì INSERT mới)
            await orderApi.finalPayment(paymentPayload);
            
            // 2. Cập nhật doanh thu ca
            await doanhthuApi.updateAfterPayment(maCaOpen, method, finalAmount);
            
            // 3. Giải phóng bàn
            await tableApi.updateTrangThai(maBan, 'PAID');

            alert("Thanh toán thành công! Đơn hàng đã được lưu chính thức. 🥂");
            navigate('/sell');
        } catch (err) {
            console.error("Lỗi Payment:", err);
            alert("Lỗi thanh toán: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return (
            <div className="payment-loading-screen">
                <Loader2 className="spin-icon" size={48} />
                <p>Đang chuẩn bị hóa đơn...</p>
            </div>
        );

    if (!order && !maHDTuState && (!cartTuState || cartTuState.length === 0)) {
        return (
            <div className="payment-error-screen">
                <AlertTriangle size={64} color="#ef4444" />
                <h2>Không tìm thấy đơn hàng</h2>
                <p>Bàn này hiện chưa có món nào để thanh toán.</p>
                <button className="btn-back-home" onClick={() => navigate('/sell')}>Quay về Sơ đồ</button>
            </div>
        );
    }

    return (
        <div className="payment-page-wrapper">
            <ReceiptModal 
                isOpen={true} 
                onClose={() => navigate(-1)} 
                maBan={maBan}
                cart={cartTuState || order?.items || []}
                subTotal={subTotalTuState || order?.tongTienGoc || 0}
                autoDiscount={autoDiscount}
                autoDiscountVal={subTotalTuState - totalTuState || 0} 
                manualDiscount={manualDiscount}
                totalAmount={totalTuState || order?.tongTien}
                onConfirm={handleConfirmPayment} 
            /> 
        </div>
    );
};

export default PaymentPage;