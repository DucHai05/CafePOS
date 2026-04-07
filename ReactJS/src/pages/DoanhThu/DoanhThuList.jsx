import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoanhThuDetail from './DoanhThuDetail';
import './DoanhThuList.css';

const API_URL_DOANHTHU = 'http://localhost:8084/api/doanhthu';
const API_URL_CA = 'http://localhost:8084/api/ca';

const DoanhThuManager = () => {
    const [doanhThus, setDoanhThus] = useState([]);
    const [selectedDoanhThu, setSelectedDoanhThu] = useState(null);
    const [filterDays, setFilterDays] = useState('7');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [doanhThuResponse, caResponse] = await Promise.all([
                axios.get(API_URL_DOANHTHU),
                axios.get(API_URL_CA)
            ]);

            const doanhThuData = doanhThuResponse.data || [];
            const caData = caResponse.data || [];

            const caMap = {};
            caData.forEach(ca => {
                if (ca.maCa) caMap[ca.maCa] = ca;
            });

            const enrichedDoanhThus = doanhThuData.map(dt => {
                const matchedCa = caMap[dt.maCa] || (dt.ca && caMap[dt.ca.maCa]) || null;
                return {
                    ...dt,
                    ca: matchedCa || dt.ca || null,
                    tongDoanhThu: (Number(dt.tienMat || 0) + Number(dt.tienCK || 0))
                };
            });

            // ✅ DI CHUYỂN ĐOẠN LOG VÀO ĐÂY (Bên trong try block)
            console.log(">>> [DEBUG] Dữ liệu Doanh Thu gốc từ API (8084):", doanhThuData);
            
            console.table(enrichedDoanhThus.map(dt => ({
                "Mã Ca": dt.maCa,
                "Tiền Mặt": dt.tienMat,
                "Chuyển Khoản": dt.tienCK,
                "Tổng Cộng": dt.tongDoanhThu
            })));
            // -------------------------------------------

            setDoanhThus(enrichedDoanhThus);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu doanh thu:', error);
            setError('Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '-';
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) {
            return dateTimeStr;
        }
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getDoanhThuDate = (doanhThu) => {
        const dateValue = doanhThu.ca?.gioMoCa || doanhThu.gioMoCa || doanhThu.gioMo || doanhThu.ca?.gioMo || doanhThu.ca?.gioBatDau || doanhThu.ca?.ngayThang;
        const parsed = new Date(dateValue);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    const filterDoanhThus = (list) => {
        if (filterDays === 'all') return list;
        const limit = Number(filterDays);
        const now = new Date();
        return list.filter((dt) => {
            const recordDate = getDoanhThuDate(dt);
            if (!recordDate) return true;
            const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
            return diffDays <= limit;
        });
    };

    if (selectedDoanhThu) {
        return (
            <DoanhThuDetail
                doanhThu={selectedDoanhThu}
                onBack={() => setSelectedDoanhThu(null)}
            />
        );
    }

    if (loading) {
        return (
            <div className="doanhthu-container">
                <div className="loading">Đang tải dữ liệu doanh thu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="doanhthu-container">
                <div className="error-message">{error}</div>
                <button className="retry-btn" onClick={fetchData}>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="doanhthu-container">
            <div className="doanhthu-header">
                <h1>Quản lý doanh thu</h1>
                <div className="filter-group">
                    <label htmlFor="filterDays">Lọc:</label>
                    <select
                        id="filterDays"
                        className="filter-select"
                        value={filterDays}
                        onChange={(e) => setFilterDays(e.target.value)}
                    >
                        <option value="7">7 ngày gần nhất</option>
                        <option value="30">30 ngày gần nhất</option>
                        <option value="90">90 ngày gần nhất</option>
                        <option value="all">Tất cả</option>
                    </select>
                </div>
            </div>

            <div className="doanhthu-grid">
                {doanhThus.length === 0 ? (
                    <div className="empty-state">
                        <h3>Không có dữ liệu doanh thu</h3>
                        <p>Chưa có ca nào được tạo hoặc có dữ liệu doanh thu.</p>
                    </div>
                ) : (
                    filterDoanhThus(doanhThus).map((doanhThu) => (
                        <div
                            key={doanhThu.maDoanhThu}
                            className="doanhthu-card"
                            onClick={() => setSelectedDoanhThu(doanhThu)}
                        >
                            <div className="card-header">
                                <h3>{doanhThu.maDoanhThu}</h3>
                                <span className="revenue-amount">
                                    {formatCurrency(doanhThu.tongDoanhThu)}
                                </span>
                            </div>

                            <div className="card-content">
                                <div className="info-row">
                                    <span className="label">Mã ca:</span>
                                    <span className="value">{doanhThu.maCa || doanhThu.ca?.maCa}</span>
                                </div>

                                <div className="info-row">
                                    <span className="label">Tên ca:</span>
                                    <span className="value">{doanhThu.ca?.tenCa || doanhThu.tenCa || '-'}</span>
                                </div>

                                <div className="info-row">
                                    <span className="label">Giờ mở:</span>
                                    <span className="value">
                                        {formatDateTime(doanhThu.ca?.gioMoCa || doanhThu.gioMoCa || doanhThu.gioMo || doanhThu.ca?.gioMo || doanhThu.ca?.gioBatDau)}
                                    </span>
                                </div>

                                <div className="info-row">
                                    <span className="label">Giờ đóng:</span>
                                    <span className="value">
                                        {formatDateTime(doanhThu.ca?.gioDongCa || doanhThu.gioDongCa || doanhThu.gioDong || doanhThu.ca?.gioKetThuc)}
                                    </span>
                                </div>

                                <div className="revenue-breakdown">
                                    <div className="revenue-item">
                                        <span>Tiền mặt:</span>
                                        <strong>{formatCurrency(doanhThu.tienMat)}</strong>
                                    </div>
                                    <div className="revenue-item">
                                        <span>Chuyển khoản:</span>
                                        <strong>{formatCurrency(doanhThu.tienCK)}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <span className={`status ${doanhThu.ca?.trangThai === 'Đóng' ? 'closed' : 'open'}`}>
                                    {doanhThu.ca?.trangThai === 'Đóng' ? '✅ Đã đóng' : '🔄 Đang mở'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoanhThuManager;