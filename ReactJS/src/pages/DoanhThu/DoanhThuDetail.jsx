import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './DoanhThuDetail.css';

const API_URL_HOADON = 'http://localhost:8081/api/hoadon';
const API_URL_BAN = 'http://localhost:8083/api/ban';
const API_URL_DOANHTHU = 'http://localhost:8084/api/doanhthu';

const DoanhThuDetail = ({ doanhThu, onBack }) => {
    const [hoaDons, setHoaDons] = useState([]);
    const [banMap, setBanMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRelatedData();
    }, [doanhThu]);

   const fetchRelatedData = async () => {
    if (!doanhThu?.maCa) {
        console.warn(">>> [DEBUG] Không tìm thấy mã ca trong doanhThu prop!");
        return;
    }

    try {
        setLoading(true);
        console.log(`>>> [SYSTEM] Bắt đầu lấy dữ liệu chi tiết cho ca: ${doanhThu.maCa}`);

        // GỌI SONG SONG 3 ĐẦU CẦU: Hóa đơn (8081), Bàn (8083), và cập nhật Doanh thu (8084)
        const [hoaDonRes, banRes, doanhThuRes] = await Promise.all([
            axios.get(`${API_URL_HOADON}/ca/${doanhThu.maCa}`),
            axios.get(API_URL_BAN),
            axios.get(`${API_URL_DOANHTHU}/ca/${doanhThu.maCa}`)
        ]);

        // --- LOG ĐỐI SOÁT ---


        // 1. Xử lý Map bàn
        const map = {};
        if (Array.isArray(banRes.data)) {
            banRes.data.forEach((ban) => {
                if (ban.maBan) map[ban.maBan] = ban.tenBan || ban.maBan;
            });
        }
        setBanMap(map);

        // 2. Xử lý Hóa đơn
        setHoaDons(hoaDonRes.data || []);
        

    } catch (error) {
        console.error('>>> [CRITICAL ERROR] Tải dữ liệu thất bại:', error);
        console.error('Chi tiết lỗi:', error.response?.data || error.message);
    } finally {
        setLoading(false);
    }
};

    const products = useMemo(() => {
        const extracted = [];

        hoaDons.forEach((order) => {
            const items = order.items || order.chiTiet || order.sanPham || order.products || [];
            if (Array.isArray(items) && items.length > 0) {
                items.forEach((item) => {
                    const maSP = item.maSanPham || item.maSP || item.id || '---';
                    const tenSP = item.tenSanPham || item.tenSP || item.name || item.ten || 'Sản phẩm';
                    const loai = item.loai || item.kieu || item.category || 'Khác';
                    const soLuong = Number(item.soLuong || item.quantity || item.qty || 0);
                    const donGia = Number(item.donGia || item.price || item.gia || 0);
                    const thanhTien = Number(item.thanhTien || item.total || soLuong * donGia);
                    extracted.push({ maSP, tenSP, loai, soLuong, donGia, thanhTien });
                });
            }
        });

        return extracted;
    }, [hoaDons]);

    const categories = useMemo(() => {
        return ['Tất cả', ...Array.from(new Set(products.map((item) => item.loai || 'Khác')))];
    }, [products]);

    // 1. Tính toán tổng tiền dựa trên danh sách hóa đơn (SỰ THẬT TỪ PORT 8081)
    const totals = useMemo(() => {
        return hoaDons.reduce((acc, order) => {
            // Lưu ý: Lấy đúng trường tiền và phương thức thanh toán từ Log F12
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
            const method = order.phuongThucThanhToan; // CASH hoặc TRANSFER

            if (method === 'CASH') {
                acc.cash += amount;
            } else if (method === 'TRANSFER') {
                acc.transfer += amount;
            }
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [hoaDons]);

    // 2. Gán giá trị để hiển thị lên giao diện
    // Mình sẽ ưu tiên số tính từ Hóa đơn (8081). Nếu hóa đơn trống mới dùng số từ Doanh thu (8084)
    const cashValue = totals.cash > 0 ? totals.cash : (doanhThu?.tienMat || 0);
    const transferValue = totals.transfer > 0 ? totals.transfer : (doanhThu?.tienCK || 0);
    const totalRevenue = cashValue + transferValue;
    
    // Tiền mặt trong két (Dữ liệu từ 8084)
    const safeCash = Number(doanhThu?.ca?.soTienKet || 0); 
    const thuValue = Number(doanhThu?.tienThu || 0);
    const chiValue = Number(doanhThu?.tienChi || 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '-';

        // 1. Kiểm tra xem đây có phải chuỗi chỉ có GIỜ không (Ví dụ: 18:01:30.0000000)
        // Dấu hiệu: Có dấu ":" nhưng không có dấu "-" của ngày tháng
        if (typeof dateTimeStr === 'string' && !dateTimeStr.includes('-') && dateTimeStr.includes(':')) {
            // Cắt bỏ phần nano giây sau dấu chấm nếu có
            return dateTimeStr.split('.')[0]; 
        }

        // 2. Nếu là chuỗi đầy đủ Ngày-Giờ (ISO String)
        try {
            const date = new Date(dateTimeStr);
            // Nếu không parse được thì trả về chuỗi gốc đã cắt gọn
            if (isNaN(date.getTime())) return dateTimeStr.split('.')[0];

            return date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return dateTimeStr.split('.')[0];
        }
    };

    const getOrderTableName = (order) => {
        return order.tenBan || order.ban || banMap[order.maBan] || order.maBan || 'Không xác định';
    };

    if (loading) {
        return (
            <div className="doanhthu-detail-container">
                <div className="loading">Đang tải chi tiết doanh thu...</div>
            </div>
        );
    }

    return (
        <div className="doanhthu-detail-container">
            <div className="detail-header-bar">
                <button className="back-button" onClick={onBack}>&larr; Trở lại</button>
                <h2>Chi tiết doanh thu - {doanhThu.maDoanhThu}</h2>
            </div>

            <div className="detail-top-grid">
                <div className="detail-card detail-card-info">
                    <h3>Thông tin ca</h3>
                    <div className="info-row">
                        <span>Mã ca:</span>
                        <strong>{doanhThu.ca?.maCa || doanhThu.maCa}</strong>
                    </div>
                    <div className="info-row">
                        <span>Tên ca:</span>
                        <strong>{doanhThu.ca?.tenCa || '-'}</strong>
                    </div>
                    <div className="info-row">
                        <span>Nhân viên:</span>
                        <strong>{doanhThu.ca?.maNhanVien || '-'}</strong>
                    </div>
                    <div className="info-row">
                        <span>Ngày:</span>
                        <strong>{doanhThu.ca?.ngayThang || '-'}</strong>
                    </div>
                    <div className="info-row">
                        <span>Giờ mở:</span>
                        <strong>{formatDateTime(doanhThu.ca?.gioMoCa)}</strong>
                    </div>
                    <div className="info-row">
                        <span>Giờ đóng:</span>
                        <strong>{formatDateTime(doanhThu.ca?.gioDongCa)}</strong>
                    </div>
                    <div className="info-row">
                        <span>Trạng thái:</span>
                        <strong>{doanhThu.ca?.trangThai || 'Đã đóng'}</strong>
                    </div>
                </div>

                <div className="detail-card detail-card-summary">
                    <h3>💰 Tổng hợp doanh thu</h3>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <span>Tiền mặt</span>
                            {/* SỬA: Dùng cashValue thay vì doanhThu.tienMat */}
                            <strong>{formatCurrency(cashValue)}</strong>
                        </div>
                        <div className="summary-item">
                            <span>Chuyển khoản</span>
                            {/* SỬA: Dùng transferValue thay vì doanhThu.tienCK */}
                            <strong>{formatCurrency(transferValue)}</strong>
                        </div>
                        <div className="summary-item summary-split">
                            <div className="split-half">
                                <span>Thu</span>
                                <strong>{formatCurrency(thuValue)}</strong>
                            </div>
                            <div className="split-half">
                                <span>Chi</span>
                                <strong>{formatCurrency(chiValue)}</strong>
                            </div>
                        </div>
                        <div className="summary-item summary-safe">
                            <span>Tiền mặt trong két</span>
                            <strong>{formatCurrency(safeCash)}</strong>
                        </div>
                        <div className="summary-item total summary-total-full">
                            <span>Tổng doanh thu</span>
                            {/* SỬA: Dùng totalRevenue thay vì doanhThu.tongDoanhThu */}
                            <strong>{formatCurrency(totalRevenue)}</strong>
                        </div>
                    </div>
                </div>



            </div>

            <div className="detail-section">
                <div className="section-header">
                    <h3>Danh sách sản phẩm bán được ({products.length} sản phẩm)</h3>
                </div>
                <div className="table-wrapper">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Loại</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">Không có sản phẩm nào được bán trong ca này.</td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={`${product.maSP}-${index}`}>
                                        <td>{product.maSP}</td>
                                        <td>{product.tenSP}</td>
                                        <td>{product.loai}</td>
                                        <td>{product.soLuong}</td>
                                        <td>{formatCurrency(product.donGia)}</td>
                                        <td>{formatCurrency(product.thanhTien)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="detail-section">
                <div className="section-header">
                    <h3>Danh sách hóa đơn ({hoaDons.length} hóa đơn)</h3>
                </div>
                <div className="order-list">
                    {hoaDons.length === 0 ? (
                        <div className="empty-state">Không có hóa đơn nào trong ca này.</div>
                    ) : (
                        hoaDons.map((order) => (
                            <div key={order.id || order.maHoaDon} className="order-card readonly">
                                <div className="order-card-header">
                                    <strong>{order.maHoaDon || order.id || 'Hóa đơn'}</strong>
                                    <span>{formatCurrency(order.tongTien || order.tongHoaDon)}</span>
                                </div>
                                <div className="order-row">
                                    <span>Bàn: {getOrderTableName(order)}</span>
                                    <span className="order-date">
                                        {formatDateTime(order.thoiGianVao || order.gioVao || order.createdAt)}
                                    </span>
                                </div>
                                <div className="order-row">
                                    <span>Thanh toán: {order.phuongThucThanhToan || order.phuongThuc || 'Tiền mặt'}</span>
                                    <span>{order.trangThai || 'Hoàn tất'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="detail-bottom-grid">
                <div className="detail-card detail-card-note">
                    <h3>Ghi chú ca</h3>
                    <p>{doanhThu.ca?.ghiChu || 'Không có ghi chú cho ca này.'}</p>
                </div>
                <div className="detail-card detail-card-promo">
                    <h3>Khuyến mãi</h3>
                    <p>{doanhThu.ca?.khuyenMai || 'Không có mã khuyến mãi áp dụng.'}</p>
                </div>
            </div>
        </div>
    );
};

export default DoanhThuDetail;