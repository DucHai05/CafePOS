import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoanhThuManager.css';

const API_URL_PHIEU = 'http://localhost:8084/api/phieuthuchi';

const DoanhThuManager = ({ ca, onBack, onRefreshCa }) => {
    const [phieuThu, setPhieuThu] = useState([]);
    const [phieuChi, setPhieuChi] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [phieuForm, setPhieuForm] = useState({
        soTien: '',
        moTa: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPhieu();
    }, [ca]);

    const fetchPhieu = async () => {
        try {
            const response = await axios.get(`${API_URL_PHIEU}/ca/${ca.maCa}`);
            const all = response.data || [];
            setPhieuThu(all.filter((item) => item.loaiPhieu === 'Thu'));
            setPhieuChi(all.filter((item) => item.loaiPhieu === 'Chi'));
        } catch (error) {
            console.error('Lỗi khi tải phiếu', error);
        }
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
        setPhieuForm({ soTien: '', moTa: '' });
    };

    const handleSavePhieu = async () => {
        if (!phieuForm.soTien || !phieuForm.moTa.trim()) {
            alert('Vui lòng nhập đầy đủ số tiền và lý do');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                soTien: parseFloat(phieuForm.soTien),
                ghiChu: phieuForm.moTa.trim(),
                maCa: ca.maCa,
                loaiPhieu: modalType === 'thu' ? 'Thu' : 'Chi'
            };

            console.log('Sending payload:', payload);
            const response = await axios.post(API_URL_PHIEU, payload);
            console.log('Response:', response);
            alert(`Thêm phiếu ${modalType === 'thu' ? 'Thu' : 'Chi'} thành công`);
            await fetchPhieu();
            if (onRefreshCa) {
                await onRefreshCa();
            }
            setModalOpen(false);
        } catch (error) {
            console.error('Lỗi khi lưu phiếu', error);
            alert('Lỗi khi lưu phiếu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setPhieuForm({ soTien: '', moTa: '' });
    };

    return (
        <div className="doanhthu-container">
            <div className="phieu-section">
                <div className="phieu-box" onClick={() => handleOpenModal('thu')}>
                    <h3>Phiếu Thu</h3>
                    <p>Số lượng: {phieuThu.length}</p>
                    <span className="phieu-add">+ Thêm phiếu thu</span>
                </div>
                <div className="phieu-box" onClick={() => handleOpenModal('chi')}>
                    <h3>Phiếu Chi</h3>
                    <p>Số lượng: {phieuChi.length}</p>
                    <span className="phieu-add">+ Thêm phiếu chi</span>
                </div>
            </div>

            <div className="receipt-list">
                <div className="receipt-column">
                    <h3>Danh sách phiếu thu</h3>
                    {phieuThu.length === 0 ? (
                        <p className="empty-state">Chưa có phiếu thu.</p>
                    ) : (
                        phieuThu.map((item) => (
                            <div key={item.maPhieu} className="receipt-item receipt-thu">
                                <strong>{item.maPhieu}</strong>
                                <span>{item.ghiChu || 'Không có mô tả'}</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.soTien || 0)}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="receipt-column">
                    <h3>Danh sách phiếu chi</h3>
                    {phieuChi.length === 0 ? (
                        <p className="empty-state">Chưa có phiếu chi.</p>
                    ) : (
                        phieuChi.map((item) => (
                            <div key={item.maPhieu} className="receipt-item receipt-chi">
                                <strong>{item.maPhieu}</strong>
                                <span>{item.ghiChu || 'Không có mô tả'}</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.soTien || 0)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Thêm Phiếu {modalType === 'thu' ? 'Thu' : 'Chi'}</h3>
                        <div className="form-group">
                            <label>Số tiền:</label>
                            <input
                                type="number"
                                value={phieuForm.soTien}
                                onChange={(e) => setPhieuForm({ ...phieuForm, soTien: e.target.value })}
                                placeholder="Nhập số tiền"
                                min="0"
                                step="1000"
                            />
                        </div>
                        <div className="form-group">
                            <label>Lý do:</label>
                            <textarea
                                value={phieuForm.moTa}
                                onChange={(e) => setPhieuForm({ ...phieuForm, moTa: e.target.value })}
                                placeholder="Nhập lý do"
                                rows="3"
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSavePhieu} disabled={loading} className="save-btn">
                                {loading ? 'Đang lưu...' : 'Xác nhận'}
                            </button>
                            <button onClick={handleCloseModal} disabled={loading} className="cancel-btn">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoanhThuManager;
