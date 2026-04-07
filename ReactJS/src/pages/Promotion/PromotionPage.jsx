import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Gift, 
  Plus, 
  Settings2, 
  Percent, 
  Database, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Palette,
  Type,
  FileText,
  Zap
} from 'lucide-react';
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
        maKhuyenMai: '', 
        tenKhuyenMai: '',
        moTa: '',
        giaTri: 0,
        loaiKhuyenMai: 'PERCENT',
        mauSac: '#4f46e5',
        loaiDoiTuong: 'ALL'
    });

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8082/api/promotions');
            setPromotions(res.data);
        } catch (err) {
            console.error("Lỗi gọi API:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPromotions(); }, []);

    // --- CÁC HÀM XỬ LÝ CRUD ---
    const openAddModal = () => {
        setEditingId(null);
        setFormData({ 
            maKhuyenMai: '', tenKhuyenMai: '', moTa: '', giaTri: 0, 
            loaiKhuyenMai: 'PERCENT', mauSac: '#4f46e5', 
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
            mauSac: p.mauSac || '#4f46e5',
            loaiDoiTuong: p.configs?.[0]?.loaiDoiTuong || 'ALL'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            giaTri: Number(formData.giaTri),
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

    if (loading) return (
        <div className="promo-loading-full">
            <Loader2 className="spin-icon" size={48} />
            <p>Đang tải dữ liệu khuyến mãi...</p>
        </div>
    );

    const eventPromos = promotions.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'ALL'));
    const typePromos = promotions.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'SELECTIVE'));

    return (
        <div className="promo-container">
            {/* HEADER */}
            <div className="promo-header">
                <div className="header-left">
                    <h1>Quản lý Khuyến mãi</h1>
                    <p className="subtitle"></p>
                </div>
                <button className="add-promo-btn" onClick={openAddModal}>
                    <Plus size={20} /> Tạo mới
                </button>
            </div>

            {/* TABS SEGMENTED */}
            <div className="promo-tabs">
                <button className={activeTab === 'event' ? 'active' : ''} onClick={() => setActiveTab('event')}>
                    <Gift size={18} /> Sự kiện hệ thống ({eventPromos.length})
                </button>
                <button className={activeTab === 'type' ? 'active' : ''} onClick={() => setActiveTab('type')}>
                    <Zap size={18} /> Ưu đãi chọn tay ({typePromos.length})
                </button>
            </div>

            {/* CONTENT */}
            <div className="promo-content">
                {activeTab === 'event' ? (
                    <EventPromoGrid data={eventPromos} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
                ) : (
                    <PromoTypeTable data={typePromos} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>

            {/* MODAL CRUD */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="promo-modal-crud">
                        <div className="modal-header-crud">
                            <div className="header-title-flex">
                                <Settings2 size={22} color="#4f46e5" />
                                <h2>{editingId ? 'Cập nhật ưu đãi' : 'Thiết lập ưu đãi mới'}</h2>
                            </div>
                            <button className="close-x" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSave}>
                            <div className="modal-body-crud">
                                <div className="form-row-crud">
                                    <div className="form-group">
                                        <label disabled><Database size={14}/> Mã KM (Duy nhất)</label>
                                        <input 
                                            type="text" required disabled={editingId}
                                            value={formData.maKhuyenMai} 
                                            onChange={e => setFormData({...formData, maKhuyenMai: e.target.value.toUpperCase()})} 
                                            placeholder="VD: KM01" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Palette size={14}/> Màu thương hiệu</label>
                                        <input type="color" value={formData.mauSac} onChange={e => setFormData({...formData, mauSac: e.target.value})} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label><Type size={14}/> Tên chương trình</label>
                                    <input type="text" required value={formData.tenKhuyenMai} onChange={e => setFormData({...formData, tenKhuyenMai: e.target.value})} placeholder="VD: Giảm giá mùa hè..." />
                                </div>

                                <div className="form-row-crud">
                                    <div className="form-group">
                                        <label><Percent size={14}/> Giá trị giảm</label>
                                        <input type="number" required value={formData.giaTri} onChange={e => setFormData({...formData, giaTri: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Đơn vị</label>
                                        <select value={formData.loaiKhuyenMai} onChange={e => setFormData({...formData, loaiKhuyenMai: e.target.value})}>
                                            <option value="PERCENT">Phần trăm (%)</option>
                                            <option value="FIXED_AMOUNT">Số tiền (VNĐ)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label><FileText size={14}/> Mô tả chi tiết</label>
                                    <textarea rows="3" value={formData.moTa} onChange={e => setFormData({...formData, moTa: e.target.value})} placeholder="Điều kiện áp dụng..." />
                                </div>
                            </div>

                            <div className="modal-footer-crud">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary-save">Xác nhận Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionPage;