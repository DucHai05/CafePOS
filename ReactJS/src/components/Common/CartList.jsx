import React from 'react';
import CartItem from './CartItem';

const CartList = ({ cart, onRemoveItem, onItemClick, onUpdateQty }) => {
    if (cart.length === 0) {
        return <div className="empty-cart">Giỏ hàng đang trống...</div>;
    }

    return (
        <div className="cart-list">
            {cart.map((item, idx) => (
                <CartItem 
                    key={`${item.maSanPham}-${idx}`}
                    item={item}
                    idx={idx}
                    onRemove={onRemoveItem}
                    onClick={onItemClick}
                    onUpdateQty={onUpdateQty}
                />
            ))}
        </div>
    );
};

export default CartList;