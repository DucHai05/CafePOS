import React from 'react';

const POSCard = ({ title, subtitle, onClick, type = 'product', isActive = false }) => {
    return (
        <div 
            className={`p-card ${isActive ? 'active' : ''} ${type}-card`} 
            onClick={onClick}
        >
            <div className="p-info">
                <h4>{title}</h4>
                <p>{subtitle}</p>
            </div>
            {/* Nếu là món ăn thì hiện dấu +, nếu là bàn thì có thể thay bằng icon khác hoặc bỏ qua */}
            <div className="p-add">
                {type === 'product' ? '+' : '→'}
            </div>
        </div>
    );
};

export default POSCard;