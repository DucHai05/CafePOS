import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KhuVucManager.css';

const API_URL = 'http://localhost:8083/api/khuvuc';

const KhuVucManager = ({ onSelectKhuVuc }) => {
    const [khuVucs, setKhuVucs] = useState([]);
    const [selectedKhuVuc, setSelectedKhuVuc] = useState(null);
    const [formData, setFormData] = useState({
        maKhuVuc: '',
        tenKhuVuc: '',
        trangThai: 'Sẵn sàng'
    });
    const [isEditing, setIsEditing] = useState(false);

    // Thêm State để quản lý thông báo lỗi và thành công
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetchKhuVucs();
    }, []);

    const fetchKhuVucs = async () => {
        try {
            const response = await axios.get(API_URL);
            setKhuVucs(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khu vực", error);
            showMessage("Không thể kết nối với máy chủ để tải dữ liệu!", true);
        }
    };

    // Hàm hiển thị thông báo trong 3 giây rồi tự tắt
    const showMessage = (msg, error = false) => {
        setMessage(msg);
        setIsError(error);
        setTimeout(() => setMessage(''), 3000); // Tự ẩn sau 3s
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset thông báo cũ

        if (isEditing) {
            return;
        }

        // 1. BẮT LỖI FRONTEND: Kiểm tra xem người dùng có nhập toàn dấu cách không
        if (!formData.maKhuVuc.trim() || !formData.tenKhuVuc.trim()) {
            showMessage("Mã và Tên khu vực không được để trống!", true);
            return; // Dừng lại, không gọi API
        }

        try {
            await axios.post(API_URL, formData);
            showMessage("Thêm khu vực mới thành công!", false);
            fetchKhuVucs();
            handleResetSelection();
        } catch (error) {
            // 2. BẮT LỖI BACKEND
            console.error("Chi tiết lỗi:", error);

            if (error.response) {
                if (error.response.status === 500 || error.response.status === 409) {
                    showMessage("Lỗi: Mã Khu Vực này đã tồn tại!", true);
                } else {
                    showMessage(`Lỗi từ máy chủ: ${error.response.status}`, true);
                }
            } else if (error.request) {
                showMessage("Không thể kết nối đến máy chủ!", true);
            } else {
                showMessage("Lỗi không xác định: " + error.message, true);
            }
        }
    };

    const handleDelete = async (id, resetAfter = false) => {
        if (window.confirm("Bạn có chắc muốn xoá khu vực này cùng tất cả bàn bên trong?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchKhuVucs();
                showMessage("Đã xóa khu vực thành công!", false);
                if (resetAfter) {
                    handleResetSelection();
                }
            } catch (error) {
                showMessage("Khu vực chứa bàn đang hoạt động không thể xóa!", true);
            }
        }
    };

    const handleEdit = (kv) => {
        setFormData(kv);
        setIsEditing(true);
        setMessage(''); // Xóa thông báo khi bắt đầu sửa
    };

    const handleSelectKhuVuc = (kv) => {
        setFormData({
            maKhuVuc: kv.maKhuVuc,
            tenKhuVuc: kv.tenKhuVuc,
            trangThai: kv.trangThai || 'Sẵn sàng'
        });
        setIsEditing(true);
        setSelectedKhuVuc(kv);
        setMessage('');
        if (onSelectKhuVuc) onSelectKhuVuc(kv);
    };

    const handleResetSelection = () => {
        setSelectedKhuVuc(null);
        setFormData({ maKhuVuc: '', tenKhuVuc: '', trangThai: 'Sẵn sàng' });
        setIsEditing(false);
        setMessage('');
        if (onSelectKhuVuc) onSelectKhuVuc(null);
    };

    const handleUpdate = async () => {
        if (!isEditing) return;
        if (!formData.tenKhuVuc.trim()) {
            showMessage("Tên khu vực không được để trống!", true);
            return;
        }

        try {
            await axios.put(`${API_URL}/${formData.maKhuVuc}`, formData);
            showMessage("Cập nhật khu vực thành công!", false);
            fetchKhuVucs();
            setSelectedKhuVuc({ ...selectedKhuVuc, ...formData });
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            if (error.response) {
                showMessage(`Lỗi từ máy chủ: ${error.response.status}`, true);
            } else if (error.request) {
                showMessage("Không thể kết nối đến máy chủ!", true);
            } else {
                showMessage("Lỗi không xác định: " + error.message, true);
            }
        }
    };

    const handleCancelEdit = () => {
        handleResetSelection();
    };

    return (
        <div className="khuvuc-container">
            <div className="khuvuc-header">
                <h2>Quản Lý Khu Vực</h2>
            </div>

            {/* HIỂN THỊ THÔNG BÁO */}
            {message && (
                <div className={`message ${isError ? 'error' : 'success'}`}>
                    <span>{isError ? '⚠️' : '✅'}</span>
                    <span>{message}</span>
                </div>
            )}

            {/* Form Khu Vực */}
            <div className="form-container">
                <h3 className="form-title">{isEditing ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Mã khu vực</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nhập mã"
                                value={formData.maKhuVuc}
                                onChange={(e) => setFormData({ ...formData, maKhuVuc: e.target.value })}
                                disabled={isEditing}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tên khu vực</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nhập tên"
                                value={formData.tenKhuVuc}
                                onChange={(e) => setFormData({ ...formData, tenKhuVuc: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select
                                className="form-select"
                                value={formData.trangThai}
                                onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                            >
                                <option value="Sẵn sàng">Sẵn sàng</option>
                                <option value="Bảo trì">Bảo trì</option>
                                <option value="Tạm ngưng">Tạm ngưng</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="form-button btn-add" disabled={isEditing}>
                            Thêm mới
                        </button>
                        <button type="button" className="form-button btn-update" onClick={handleUpdate} disabled={!isEditing}>
                            Cập nhật
                        </button>
                        <button type="button" className="form-button btn-delete" onClick={() => handleDelete(formData.maKhuVuc, true)} disabled={!isEditing}>
                            Xóa
                        </button>
                        {isEditing && (
                            <button type="button" className="form-button btn-back" onClick={handleCancelEdit}>
                                Quay lại
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Danh sách Khu Vực (Grid 3 thẻ/hàng, Hình vuông) */}
            <div className="khuvuc-card-container">
                {khuVucs.length === 0 ? (
                    <div className="empty-state">
                        <p>Chưa có khu vực nào.</p>
                    </div>
                ) : (
                    khuVucs.map(kv => (
                        <div
                            key={kv.maKhuVuc}
                            className={`khuvuc-card ${selectedKhuVuc?.maKhuVuc === kv.maKhuVuc ? 'selected' : ''}`}
                            onClick={() => handleSelectKhuVuc(kv)}
                        >
                            <h4 className="card-title">{kv.tenKhuVuc}</h4>
                            <p className="card-code">{kv.maKhuVuc}</p>
                            <div className={`card-status ${kv.trangThai === 'Sẵn sàng' ? 'status-ready' :
                                kv.trangThai === 'Bảo trì' ? 'status-maintenance' : 'status-paused'}`}>
                                <span>●</span> {kv.trangThai}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default KhuVucManager;