import React, { useEffect, useRef } from 'react';
import '../CommonCSS/OrderDropdown.css';

const OrderDropdown = ({ 
    show, 
    onClose, 
    onOpenPromo, 
    onPrintKitchen, 
    onOpenOrderNote 
}) => {
    const dropdownRef = useRef(null);

    // Xử lý click ra ngoài menu thì tự đóng
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="dropdown-menu" ref={dropdownRef}>
            <button onClick={() => { onOpenPromo(); onClose(); }}>
                <i className="fa-tag"></i> Khuyến mãi
            </button>
            <button onClick={() => { onPrintKitchen(); onClose(); }}>
                <i className="fa-print"></i> Gộp bàn
            </button>
            <button onClick={() => { onOpenOrderNote(); onClose(); }}>
                <i className="fa-sticky-note"></i> Chuyển bàn
            </button>
        </div>
    );
};

export default OrderDropdown;