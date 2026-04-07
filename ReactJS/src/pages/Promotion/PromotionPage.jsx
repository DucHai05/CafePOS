import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventPromoGrid from '../../components/Promotion/EventPromoGrid';
import PromoTypeTable from '../../components/Promotion/PromoTypeTable';
import './PromotionPage.css';

const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('event');

    // --- STATE CHO MODAL CRUD ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    const [formData, setFormData] = useState({
        maKhuyenMai: '', // CỰC KỲ QUAN TRỌNG: Để fix lỗi Identifier manual assigned
        tenKhuyenMai: '',
        moTa: '',
        giaTri: 0,
        loaiKhuyenMai: 'PERCENT',
        mauSac: '#0ea5e9',
        loaiDoiTuong: 'ALL'
    });

    const fetchPromotions = async () => {
        try {
            const res = await axios.get('http://localhost:8082/api/promotions');
            setPromotions(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi gọi API:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchPromotions(); }, []);

    // --- CÁC HÀM XỬ LÝ CRUD ---
    const openAddModal = () => {
        setEditingId(null);
        setFormData({ 
            maKhuyenMai: '', 
            tenKhuyenMai: '', 
            moTa: '', 
            giaTri: 0, 
            loaiKhuyenMai: 'PERCENT', 
            mauSac: '#0ea5e9', 
            loaiDoiTuong: activeTab === 'event' ? 'ALL' : 'SELECTIVE' 
        });
        setIsModalOpen(true);
    };

    const handleEdit = (p) => {
        setEditingId(p.maKhuyenMai);
        setFormData({
            maKhuyenMai: p.maKhuyenMai,
            tenKhuyenMai: p.tenKhuyenMai,
            moTa: p.moTa,
            giaTri: p.giaTri,
            loaiKhuyenMai: p.loaiKhuyenMai,
            mauSac: p.mauSac || '#0ea5e9',
            loaiDoiTuong: p.configs?.[0]?.loaiDoiTuong || 'ALL'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Ép kiểu dữ liệu để tránh lỗi 500 ở Backend
        const payload = {
            maKhuyenMai: formData.maKhuyenMai,
            tenKhuyenMai: formData.tenKhuyenMai,
            moTa: formData.moTa,
            giaTri: Number(formData.giaTri),
            loaiKhuyenMai: formData.loaiKhuyenMai,
            mauSac: formData.mauSac,
            trangThai: true,
            configs: [{ 
                loaiDoiTuong: formData.loaiDoiTuong,
                giaTriDonToiThieu: 0,
                ap_dung_cho_mon: 'ALL'
            }]
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:8082/api/promotions/${editingId}`, payload);
            } else {
                await axios.post('http://localhost:8082/api/promotions', payload);
            }
            setIsModalOpen(false);
            fetchPromotions();
        } catch (err) { 
            alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu dữ liệu!")); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Xác nhận xóa mã ${id}?`)) {
            try {
                await axios.delete(`http://localhost:8082/api/promotions/${id}`);
                fetchPromotions();
            } catch (err) { alert("Không thể xóa!"); }
        }
    };

    const handleToggle = async (id) => {
        try {
            await axios.patch(`http://localhost:8082/api/promotions/${id}/status`);
            fetchPromotions();
        } catch (err) { alert("Lỗi cập nhật trạng thái!"); }
    };

    const eventPromos = promotions.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'ALL'));
    const typePromos = promotions.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'SELECTIVE'));

    if (loading) return <div className="promo-container">Đang kết nối hệ thống...</div>;

    return (
        <div className="promo-container">
            <div className="promo-header">
                <div>
                    <h1>Quản lý Khuyến mãi</h1>
                    <p className="subtitle">Thiết lập ưu đãi cho Sabo Coffee</p>
                </div>
                <button className="add-promo-btn" onClick={openAddModal}>+ Tạo mới</button>
            </div>

            <div className="promo-tabs">
                <button className={activeTab === 'event' ? 'active' : ''} onClick={() => setActiveTab('event')}>
                    Sự kiện & Dịp lễ ({eventPromos.length})
                </button>
                <button className={activeTab === 'type' ? 'active' : ''} onClick={() => setActiveTab('type')}>
                    Tùy chọn nhân viên ({typePromos.length})
                </button>
            </div>

            <div className="promo-content">
                {activeTab === 'event' ? (
                    <EventPromoGrid data={eventPromos} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
                ) : (
                    <PromoTypeTable data={typePromos} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>

            {/* --- MODAL CRUD --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="promo-modal-crud">
                        <div className="modal-header-crud">
                            <h2>{editingId ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi mới'}</h2>
                            <button className="close-x" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body-crud">
                                <div className="form-row-crud">
                                    <div className="form-group">
                                        <label>Mã KM (Duy nhất)</label>
                                        <input 
                                            type="text" required disabled={editingId}
                                            value={formData.maKhuyenMai} 
                                            onChange={e => setFormData({...formData, maKhuyenMai: e.target.value.toUpperCase()})} 
                                            placeholder="VD: KM01..." 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Màu sắc hiển thị</label>
                                        <input type="color" value={formData.mauSac} onChange={e => setFormData({...formData, mauSac: e.target.value})} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Tên chương trình</label>
                                    <input type="text" required value={formData.tenKhuyenMai} onChange={e => setFormData({...formData, tenKhuyenMai: e.target.value})} />
                                </div>
                                <div className="form-row-crud">
                                    <div className="form-group">
                                        <label>Mức giảm</label>
                                        <input type="number" value={formData.giaTri} onChange={e => setFormData({...formData, giaTri: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Loại</label>
                                        <select value={formData.loaiKhuyenMai} onChange={e => setFormData({...formData, loaiKhuyenMai: e.target.value})}>
                                            <option value="PERCENT">Phần trăm (%)</option>
                                            <option value="FIXED_AMOUNT">Số tiền (đ)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mô tả chi tiết</label>
                                    <textarea rows="3" value={formData.moTa} onChange={e => setFormData({...formData, moTa: e.target.value})} />
                                </div>
                            </div>
                            <div className="modal-footer-crud">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary-save">Lưu cấu hình</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionPage;