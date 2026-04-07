import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './CaDetail.css';

const API_URL_DOANHTHU = 'http://localhost:8084/api/doanhthu';
const API_URL_HOADON = 'http://localhost:8081/api/hoadon';

const CaDetail = ({ ca, banMap, onBack }) => {
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('Tất cả');
    const [doanhThu, setDoanhThu] = useState(null);
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true);

    // 1. Fetch dữ liệu song song từ 2 Service
    useEffect(() => {
        const fetchData = async () => {
            if (!ca?.maCa) return;
            try {
                setLoading(true);
                const [resDoanhThu, resHoaDon] = await Promise.all([
                    axios.get(`${API_URL_DOANHTHU}/ca/${ca.maCa}`),
                    axios.get(`${API_URL_HOADON}/ca/${ca.maCa}`)
                ]);

                if (resDoanhThu.data) {
                    setDoanhThu(Array.isArray(resDoanhThu.data) ? resDoanhThu.data[0] : resDoanhThu.data);
                }
                setOrders(resHoaDon.data || []);
            } catch (error) {
                console.error("Lỗi fetch dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ca]);

    // 2. Tính toán tiền từ Hóa đơn (8081) - Dùng cái này để hiển thị
    // Đổi hoaDons thành orders
    const totals = useMemo(() => {
        return orders.reduce((acc, order) => { // Sửa ở đây
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
            const method = order.phuongThucThanhToan;

            if (method === 'CASH' || method === 'Tiền mặt') {
                acc.cash += amount;
            } else if (method === 'TRANSFER' || method === 'Chuyển khoản') {
                acc.transfer += amount;
            }
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [orders]);

    // 3. Xử lý danh sách sản phẩm (Lấy trực tiếp từ orders)
    const allProductsInOrders = useMemo(() => {
        const extracted = [];
        orders.forEach((order) => {
            const items = order.items || order.chiTiet || [];
            items.forEach((item) => {
                extracted.push({
                    maSP: item.maSanPham || '---',
                    tenSP: item.tenSanPham || 'Sản phẩm',
                    loai: item.loai || 'Khác',
                    soLuong: Number(item.soLuong || 0),
                    donGia: Number(item.giaBan || 0),
                    thanhTien: Number(item.thanhTien || (item.soLuong * item.giaBan))
                });
            });
        });
        return extracted;
    }, [orders]);

    // 4. Lọc sản phẩm theo Search và Category cho UI
    const categories = useMemo(() => {
        return ['Tất cả', ...Array.from(new Set(allProductsInOrders.map((item) => item.loai)))];
    }, [allProductsInOrders]);

    const filteredProducts = useMemo(() => {
        return allProductsInOrders.filter((product) => {
            const matchesCategory = category === 'Tất cả' || product.loai === category;
            const matchesSearch = !searchText || 
                `${product.maSP} ${product.tenSP}`.toLowerCase().includes(searchText.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allProductsInOrders, category, searchText]);

    // 5. Khai báo biến hiển thị (Mapping dữ liệu)
    const cashValue = totals.cash > 0 ? totals.cash : (doanhThu?.tienMat || 0);
    const transferValue = totals.transfer > 0 ? totals.transfer : (doanhThu?.tienCK || 0);
    const totalRevenue = cashValue + transferValue;
    const safeCash = Number(ca.soTienKet || 0); 
    const thuValue = Number(doanhThu?.tienThu ?? 0);
    const chiValue = Number(doanhThu?.tienChi ?? 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };
    
    if (loading) return <div className="loading">Đang đối soát dữ liệu ca...</div>;

    return (
        <div className="detail-page">
            <div className="detail-header-bar">
                <button className="back-button" onClick={onBack}>&larr; Trở lại</button>
                <h2>Chi tiết ca làm việc</h2>
            </div>

            <div className="detail-top-grid">
                {/* Thẻ thông tin */}
                <div className="detail-card">
                    <h3>📋 Thông tin ca</h3>
                    <div className="info-row"><span>Mã ca</span><strong>{ca.maCa || '-'}</strong></div>
                    <div className="info-row"><span>Nhân viên</span><strong>{ca.tenNhanVien || ca.maNhanVien || '-'}</strong></div>
                    <div className="info-row"><span>Ngày</span><strong>{ca.ngayThang || '-'}</strong></div>
                    <div className="info-row"><span>Giờ mở</span><strong>{ca.gioMoCa || '-'}</strong></div>
                    <div className="info-row"><span>Giờ đóng</span><strong>{ca.gioDongCa || 'Đang mở'}</strong></div>
                    <div className="info-row">
                        <span>Trạng thái</span>
                        <span className="status-badge">{ca.trangThai || 'Đang hoạt động'}</span>
                    </div>
                </div>

                {/* Thẻ doanh thu */}
                <div className="detail-card">
                    <h3>💰 Tổng hợp doanh thu</h3>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <span className="label">Tiền mặt</span>
                            <span className="value">{formatCurrency(cashValue)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Chuyển khoản</span>
                            <span className="value">{formatCurrency(transferValue)}</span>
                        </div>
                        
                        <div className="summary-item summary-split">
                            <div className="split-box thu">
                                <span className="label">Thu</span>
                                <span className="value">+{formatCurrency(thuValue)}</span>
                            </div>
                            <div className="split-box chi">
                                <span className="label">Chi</span>
                                <span className="value">-{formatCurrency(chiValue)}</span>
                            </div>
                        </div>

                        <div className="summary-item summary-safe">
                            <span className="label">Tiền trong két</span>
                            <span className="value">{formatCurrency(safeCash)}</span>
                        </div>

                        <div className="summary-item total">
                            <span className="label">TỔNG DOANH THU</span>
                            <span className="value">{formatCurrency(totalRevenue)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <div className="section-header">
                    <h3>Sản phẩm đã bán</h3>
                    <div className="section-actions">
                        <input
                            type="text"
                            placeholder="Tìm mã, tên..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="table-wrapper">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã SP</th>
                                <th>Tên sản phẩm</th>
                                <th>Loại</th>
                                <th>SL</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr><td colSpan="6" className="empty-row">Không tìm thấy sản phẩm.</td></tr>
                            ) : (
                                filteredProducts.map((p, i) => (
                                    <tr key={`${p.maSP}-${i}`}>
                                        <td><strong>{p.maSP}</strong></td>
                                        <td>{p.tenSP}</td>
                                        <td>{p.loai}</td>
                                        <td>{p.soLuong}</td>
                                        <td>{p.donGia.toLocaleString()} đ</td>
                                        <td><strong>{p.thanhTien.toLocaleString()} đ</strong></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="detail-bottom-grid">
                <div className="detail-card">
                    <h3>Ghi chú ca</h3>
                    <p>{ca.ghiChu || 'Không có ghi chú.'}</p>
                </div>
                <div className="detail-card">
                    <h3>Khuyến mãi</h3>
                    <p>{ca.khuyenMai || 'Không áp dụng.'}</p>
                </div>
            </div>
        </div>
    );
};

export default CaDetail;