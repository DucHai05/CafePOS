import React from 'react';
import './TableCard.css'; // Chúng ta sẽ viết CSS ở dưới

const TableCard = ({ table, onClick }) => {
    // 1. Kiểm tra đúng tên trường từ Backend trả về (trangThaiThanhToan)
    // 2. Ép kiểu về String và Trim để tránh lỗi khoảng trắng dư 9 ký tự như lúc đầu
    const status = String(table.trangThaiThanhToan || "").trim().toUpperCase();
    
    const isOccupied = status === 'PENDING'

    return (
        <div 
            // Dùng class 'occupied' và 'empty' để CSS dễ quản lý hơn là 'PENDING'/'Paid'
            className={`table-card ${isOccupied ? 'occupied' : 'empty'}`} 
            onClick={() => onClick(table)}
        >
            <div className="table-icon">🪑</div>
            <div className="table-number">{table.tenBan}</div>
            <div className="table-status">
                {isOccupied ? 'Có khách' : 'Bàn trống'}
            </div>
            {isOccupied && <div className="pulse-animation"></div>}
        </div>
    );
};

export default TableCard;