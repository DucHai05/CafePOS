import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BanManager.css';

const API_URL = 'http://localhost:8083/api/ban';

const BanManager = ({ khuVuc }) => {
    const [bans, setBans] = useState([]);
    const [formData, setFormData] = useState({
        maBan: '',
        tenBan: '',
        trangThaiBan: 'Hoạt động'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const showMessage = (msg, error = false) => {
        setMessage(msg);
        setIsError(error);
        setTimeout(() => setMessage(''), 3000);
    };

    // ✅ ĐƯA HOOK LÊN TRÊN CÙNG (Trước mọi lệnh return)
    useEffect(() => {
        if (khuVuc && khuVuc.maKhuVuc) {
            setBans([]); // Xóa danh sách bàn cũ để tránh "nhầm" giao diện khi chờ load
            fetchBans();
            setFormData({ maBan: '', tenBan: '', trangThaiBan: 'Hoạt động' });
            setIsEditing(false);
        }
    }, [khuVuc]);

    const fetchBans = async () => {
        if (!khuVuc || !khuVuc.maKhuVuc) return;
        try {
            const response = await axios.get(`${API_URL}/khuvuc/${khuVuc.maKhuVuc}`);
            setBans(response.data);
        } catch (error) {
            console.error("Lỗi gọi API lấy bàn:", error);
            showMessage("Không thể tải danh sách bàn", true);
        }
    };

    // ✅ CHECK NULL SAU KHI GỌI HOOK
    if (!khuVuc) {
        return (
            <div className="ban-placeholder">
                <h3>Vui lòng chọn một khu vực để quản lý bàn</h3>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            maKhuVuc: khuVuc.maKhuVuc // Đảm bảo luôn lấy đúng khu vực đang chọn
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${formData.maBan}`, payload);
                showMessage("Cập nhật bàn thành công!");
            } else {
                await axios.post(API_URL, payload);
                showMessage("Thêm bàn mới thành công!");
            }
            fetchBans();
            setFormData({ maBan: '', tenBan: '', trangThaiBan: 'Hoạt động' });
            setIsEditing(false);
        } catch (error) {
            showMessage(error.response?.data?.message || "Lỗi thao tác dữ liệu", true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xoá bàn ${id}?`)) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchBans();
                showMessage("Xoá bàn thành công!");
            } catch (error) {
                showMessage("Lỗi khi xoá bàn", true);
            }
        }
    };

    return (
        <div className="card-container-full">
            <h2>Quản Lý Bàn - Khu vực: <span style={{ color: '#3498db' }}>{khuVuc.tenKhuVuc}</span></h2>

            {/* Phần hiển thị Message */}
            {message && (
                <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`} style={{
                    padding: '10px', marginBottom: '15px', borderRadius: '5px',
                    backgroundColor: isError ? '#ffe6e6' : '#e6ffe6',
                    color: isError ? '#cc0000' : '#006600',
                    border: `1px solid ${isError ? '#ff9999' : '#99ff99'}`
                }}>
                    <strong>{isError ? '⚠️ ' : '✅ '}</strong>{message}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="form-style">   
                <input
                    type="text" placeholder="Mã Bàn" value={formData.maBan}
                    onChange={(e) => setFormData({ ...formData, maBan: e.target.value })}
                    disabled={isEditing} required
                />
                <input
                    type="text" placeholder="Tên Bàn" value={formData.tenBan}
                    onChange={(e) => setFormData({ ...formData, tenBan: e.target.value })} required
                />
                <select
                    value={formData.trangThaiBan}
                    onChange={(e) => setFormData({ ...formData, trangThaiBan: e.target.value })}
                >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Bảo trì">Bảo trì</option>
                </select>


                <button type="submit" className="btn-save">{isEditing ? 'Cập Nhật' : 'Thêm Bàn'}</button>
                {isEditing && (
                    <button type="button" className="btn-cancel" onClick={() => {
                        setIsEditing(false);
                        setFormData({ maBan: '', tenBan: '', trangThaiBan: 'Hoạt động' });
                    }}>Hủy</button>
                )}
            </form>

            {/* Table */}
            <table>
                <thead>
                    <tr>
                        <th>Mã Bàn</th>
                        <th>Tên Bàn</th>
                        <th>Trạng Thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {bans.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Khu vực này hiện chưa có bàn nào.</td></tr>
                    ) : (
                        bans.map(ban => (
                            <tr key={ban.maBan}>
                                <td><b>{ban.maBan}</b></td>
                                <td>{ban.tenBan}</td>
                                <td>
                                    <span className={ban.trangThaiBan === 'Hoạt động' ? 'status-ready' : 'status-busy'}>
                                        {ban.trangThaiBan}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => { setFormData(ban); setIsEditing(true); }} className="btn-edit">Sửa</button>
                                    <button onClick={() => handleDelete(ban.maBan)} className="btn-delete">Xoá</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BanManager;