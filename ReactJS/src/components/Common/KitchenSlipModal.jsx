import React from 'react';
import '../CommonCSS/kitchenSlipModal.css';

const KitchenSlipModal = ({ isOpen, onClose, maBan, khuVuc, cart, onConfirm }) => {
    if (!isOpen) return null;

    // Tự động kiểm tra xem đây là đơn mới hoàn toàn hay đơn có điều chỉnh
    const isAdjusting = cart.some(item => item.ghiChu?.includes("HỦY") || item.ghiChu?.includes("THÊM"));

    return (
        <div className="modal-overlay">
            <div className="kitchen-paper">
                <div className="kitchen-header">
                    <h2>PHIẾU CHẾ BIẾN</h2>
                    {/* Nếu có thay đổi thì hiện ĐIỀU CHỈNH, không thì hiện MỚI */}
                    <p className={`order-type ${isAdjusting ? 'type-adjust' : ''}`}>
                        {isAdjusting ? 'ĐIỀU CHỈNH' : 'MỚI'}
                    </p>
                </div>

                <div className="kitchen-info">
                    <div className="info-row">
                        <span>Bàn: <strong>{maBan}</strong></span>
                        <span>{khuVuc}</span>
                    </div>
                </div>

                <table className="kitchen-table">
                    <tbody>
                        {cart.map((item, i) => {
                            // Kiểm tra hành động dựa trên ghi chú Backend gửi về
                            const isCancel = item.ghiChu?.includes("HỦY");
                            const isAdd = item.ghiChu?.includes("THÊM");

                            return (
                                <tr key={`${item.maSanPham}-${i}`} className={isCancel ? 'row-cancel' : ''}>
                                    <td>
                                        <div className="item-name-big">{item.tenSanPham}</div>
                                        {/* Hiện ghi chú hành động (Hủy/Thêm) ngay dưới tên món */}
                                        {(isCancel || isAdd) && (
                                            <div className={`item-action-tag ${isCancel ? 'txt-red' : 'txt-blue'}`}>
                                                {item.ghiChu}
                                            </div>
                                        )}
                                    </td>
                                    <td className="item-qty-big text-right">
                                        x{item.soLuong}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="receipt-actions">
                    <button className="btn-print" onClick={onConfirm}>XÁC NHẬN IN</button>
                    <button className="btn-close" onClick={onClose}>HỦY</button>
                </div>
            </div>
        </div>
    );
};

export default KitchenSlipModal;