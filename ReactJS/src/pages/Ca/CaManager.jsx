import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoanhThuManager from './DoanhThuManager.jsx';
import CaDetail from './CaDetail.jsx';
import HoaDonDetail from '../HoaDon/HoaDonDetail.jsx';
import './CaManager.css';

const API_URL = 'http://localhost:8084/api/ca';
const API_URL_HOADON = 'http://localhost:8081/api/hoadon';
const API_URL_BAN = 'http://localhost:8083/api/ban';

const CaManager = () => {
    const [cas, setCas] = useState([]);
    const [activeCa, setActiveCa] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [tab, setTab] = useState('orders');
    const [hoaDons, setHoaDons] = useState([]);
    const [banMap, setBanMap] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openShiftDialog, setOpenShiftDialog] = useState(false);
    const [initialCash, setInitialCash] = useState('');

    useEffect(() => {
        fetchOpenCaState();
        fetchHoaDons();
        fetchBanMap();
    }, []);

    const fetchOpenCaState = async () => {
        try {
            const response = await axios.get(`${API_URL}/kiem-tra-ca-mo`);
            const data = response.data || {};
            console.log('Check ca mo response:', data);

            setActiveCa(data.ca || null);
            setOpenShiftDialog(data.batBuocMoCa === true);

            // Hiển thị message từ backend nếu có
            if (data.message) {
                console.log('Backend message:', data.message);
            }
        } catch (error) {
            console.warn('Không thể gọi kiem-tra-ca-mo, fallback về fetchCas', error);
            fetchCas();
        }
    };

    const fetchCas = async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data;
            setCas(data);
            
            // Tìm ca đang hoạt động
            const currentActive = data.find(c => c.trangThai === 'Mở');
            
            if (currentActive) {
                setActiveCa(currentActive);
                setOpenShiftDialog(false);
            } else {
                // KHÔNG CÓ CA ĐANG MỞ -> Bật ngay dialog yêu cầu mở ca
                setActiveCa(null);
                setOpenShiftDialog(true);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách ca', error);
        }
    };

    const fetchBanMap = async () => {
        try {
            const response = await axios.get(API_URL_BAN);
            const map = {};
            (response.data || []).forEach((ban) => {
                if (ban.maBan) map[ban.maBan] = ban.tenBan || ban.maBan;
            });
            setBanMap(map);
        } catch (error) {
            console.error('Lỗi khi tải danh sách bàn', error);
        }
    };

    // Logic xử lý gọi API mở ca mới
    const handleConfirmOpenCa = async () => {
        const amount = parseFloat(initialCash);
        if (isNaN(amount) || amount < 0) {
            alert('Vui lòng nhập số tiền ban đầu hợp lệ.');
            return;
        }

        try {
            console.log('Sending query param:', { soTienKet: amount });
            const response = await axios.post(`${API_URL}/mo-ca`, null, {
                params: { soTienKet: amount }
            });
            console.log('Response:', response);

            const newCa = response.data;
            alert(`Mở ca ${newCa.maCa} (${newCa.tenCa}) thành công!`);

            setOpenShiftDialog(false);
            setInitialCash('');
            fetchOpenCaState(); // Tải lại trạng thái ca từ backend
        } catch (error) {
            console.error('Lỗi khi mở ca:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            const errorMessage = error.response?.data?.error ||
                               error.response?.data?.message ||
                               error.message;
            alert(`Không thể mở ca mới. Lỗi: ${errorMessage}`);
        }
    };

    // Các hàm format và fetch phụ trợ (giữ nguyên như cũ)
    const formatCurrency = (v) => typeof v === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v) : '-';
    const formatDateTime = (s) => {
        if (!s || s === '-') return '-';
        const d = new Date(s);
        return isNaN(d.getTime()) ? s : `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    const fetchHoaDons = async () => {
        try {
            const response = await axios.get(API_URL_HOADON);
            setHoaDons(response.data || []);
        } catch (e) { console.error(e); }
    };

    const handleCloseCa = async () => {
        if (!activeCa?.maCa) return;
        try {
            await axios.put(`${API_URL}/${activeCa.maCa}/dong-ca`);
            await fetchOpenCaState(); // Tải lại trạng thái ca từ backend
            alert(`Đã đóng ca thành công.`);
        } catch (e) {
            console.error('Lỗi đóng ca', e);
            alert('Lỗi đóng ca');
        }
    };

    const getOrderTableName = (order) => {
        return order.tenBan || order.ban || banMap[order.maBan] || order.maBan || 'Không xác định';
    };

    const filteredHoaDons = hoaDons.filter(o => o.maCa === activeCa?.maCa);

    if (selectedOrder) return <HoaDonDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;

    if (showDetail && activeCa) {
        return (
            <div className="ca-container">
                <CaDetail
                    ca={activeCa}
                    orders={hoaDons}
                    banMap={banMap}
                    onBack={() => setShowDetail(false)}
                />
                <DoanhThuManager ca={activeCa} onRefreshCa={fetchCas} />
            </div>
        );
    }

    // TRƯỜNG HỢP: KHÔNG CÓ CA HOẠT ĐỘNG
    if (!activeCa && openShiftDialog) {
        return (
            <div className="ca-container no-active-ca">
                <div className="no-shift-overlay" />
                <div className="modal-shift forced">
                    <div className="modal-shift-content">
                        <h2>⚠️ Chưa có ca làm việc</h2>
                        <p>Bạn phải mở ca mới để bắt đầu bán hàng.</p>
                        <hr />
                        <label>Số tiền mặt ban đầu (VND):</label>
                        <input 
                            type="number" 
                            autoFocus
                            value={initialCash} 
                            onChange={(e) => setInitialCash(e.target.value)} 
                            placeholder="Nhập số tiền..."
                        />
                        <button className="confirm-btn open-now" onClick={handleConfirmOpenCa}>
                            XÁC NHẬN MỞ CA
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ca-container">
            <h1>Quản lý ca</h1>

            <div className="ca-card">
                <div className="card-meta">
                    <p className="meta-label">Ca đang làm việc {activeCa?.trangThai === 'Đóng' && '(Đã đóng)'}</p>
                    <span>{activeCa?.tenCa || `Ngày: ${activeCa?.ngayThang || '-'}`}</span>
                </div>

                <div className="ca-grid">
                    <div className="ca-field"><label>Mã ca</label><span>{activeCa?.maCa}</span></div>
                    <div className="ca-field"><label>Nhân viên</label><span>{activeCa?.maNhanVien || '-'}</span></div>
                    <div className="ca-field"><label>Giờ mở</label><span>{formatDateTime(activeCa?.gioMoCa || activeCa?.gioBatDau)}</span></div>
                    <div className="ca-field">
                        <label>Giờ đóng</label>
                        <span>{activeCa?.trangThai === 'Đóng' ? formatDateTime(activeCa?.gioDongCa) : 'Mở'}</span>
                    </div>
                </div>

                <div className="ca-actions">
                    <button className="close-shift-btn" onClick={handleCloseCa} disabled={activeCa?.trangThai === 'Đóng'}>
                        Đóng ca
                    </button>
                    <button className="detail-btn" onClick={() => setShowDetail(true)}>
                        Chi tiết ca
                    </button>
                </div>
            </div>

            {/* Tabs và danh sách hóa đơn bên dưới giữ nguyên... */}
            <div className="ca-tabs">
                <button className={tab === 'orders' ? 'tab-button active' : 'tab-button'} onClick={() => setTab('orders')}>
                    Hóa đơn trong ca
                </button>
            </div>

            <div className="order-list">
                {filteredHoaDons.length === 0 ? (
                    <div className="empty-state">Chưa có hóa đơn trong ca này.</div>
                ) : (
                    filteredHoaDons.map((order) => (
                        <div key={order.id || order.maHoaDon || order.soHoaDon} className="order-card" onClick={() => setSelectedOrder(order)}>
                            <div className="order-card-header">
                                <strong>{order.maHoaDon || order.id || 'Hóa đơn'}</strong>
                                <span>{formatCurrency(order.tongTien || order.tongHoaDon)}</span>
                            </div>
                            <div className="order-row">
                                <span>Bàn: {getOrderTableName(order)}</span>
                                <span className="order-date">{formatDateTime(order.thoiGianVao || order.gioVao || order.createdAt || order.ngayThang)}</span>
                            </div>
                            <div className="order-row">
                                <span>Thanh toán: {order.phuongThucThanhToan || order.phuongThuc || order.paymentMethod || 'Tiền mặt'}</span>
                                <span>{order.trangThai || order.status || 'Hoàn tất'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CaManager;