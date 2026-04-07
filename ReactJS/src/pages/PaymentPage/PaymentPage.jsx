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
            const finalMaHD = order?.maHoaDon || maHDTuState;
            const finalAmount = totalTuState || order?.tongTien;

            const paymentPayload = {
                maHoaDon: finalMaHD,
                maBan: maBan,
                phuongThucThanhToan: method,
                maKhuyenMai: manualDiscount?.maKhuyenMai || autoDiscount?.maKhuyenMai || null,
                tongTienSauKM: totalAmount,
                thoiGianThanhToan: new Date().toISOString(),
                trangThaiThanhToan: 'Paid',
                tongTienGoc: subTotal,
                nhanVienThucHien: 'DucHaii'
            };

            // Thực hiện chuỗi API
            await orderApi.finalPayment(paymentPayload);
            await doanhthuApi.updateAfterPayment(maCaOpen, method, finalAmount);
            await tableApi.updateTrangThai(maBan, 'PAID');

            alert("Thanh toán thành công! 🥂");
            navigate('/sell');
        } catch (err) {
            alert("Lỗi thanh toán: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return (
        <div className="payment-loading-screen">
            <Loader2 className="spin-icon" size={48} />
            <p>Đang chuẩn bị hóa đơn...</p>
        </div>
    );

    if (!order && !maHDTuState) return (
        <div className="payment-error-screen">
            <AlertTriangle size={64} color="#ef4444" />
            <h2>Không tìm thấy đơn hàng</h2>
            <p>Bàn này hiện chưa có hóa đơn nào cần thanh toán.</p>
            <button className="btn-back-home" onClick={() => navigate('/sell')}>Quay về Sơ đồ</button>
        </div>
    );

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