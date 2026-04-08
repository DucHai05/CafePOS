import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Info, MoreVertical, X } from 'lucide-react'; // Icon cho chuyên nghiệp
import { orderApi } from '../../api/orderAPI';
import { promoApi } from '../../api/promotionAPI';
import { tableApi } from '../../api/tableAPI';
import { doanhthuApi } from '../../api/doanhthuAPI'; 
import PhanLoaiCard from '../../components/Common/PhanLoaiCard'; 
import CategoryTab from '../../components/Common/CategoryTab';
import KitchenSlipModal from '../../components/Common/KitchenSlipModal';
import CartFooter from '../../components/Common/CartFooter';
import PromotionModal from '../../components/Common/PromotionModal';
import NoteModal from '../../components/Common/NoteModal';
import CartList from '../../components/Common/CartList';
import OrderDropdown from '../../components/Common/OrderDropdown';
import ConfirmDeleteModal from '../../components/Common/ConfirmDeleteModal';
import * as CartHelpers from '../../utils/cartHelpers';
import './orderPage.css';
const OrderPage = () => {
    const { maBan } = useParams();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [allPromos, setAllPromos] = useState([]);
    const [maHoaDon, setMaHoaDon] = useState(null);
    const [maCaOpen, setMaCaOpen] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isKitchenSlipOpen, setIsKitchenSlipOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [editingIdx, setEditingIdx] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, index: null, item: null });
    const [itemsToPrint, setItemsToPrint] = useState([]);

    const [autoDiscount, setAutoDiscount] = useState(null);
    const [manualDiscount, setManualDiscount] = useState(null);
    const [availablePromos, setAvailablePromos] = useState([]);
    const [originalCart, setOriginalCart] = useState([]);


    // Khuyen mai
    const subTotal = React.useMemo(() => 
        CartHelpers.calculateSubTotal(cart), [cart]);

    const autoDiscountVal = React.useMemo(() => 
        CartHelpers.calculateDiscountValue(autoDiscount, subTotal), [autoDiscount, subTotal]);

    const manualDiscountVal = React.useMemo(() => 
        CartHelpers.calculateDiscountValue(manualDiscount, subTotal), [manualDiscount, subTotal]);

    const totalAmount = React.useMemo(() => 
        CartHelpers.calculateFinalTotal(subTotal, autoDiscountVal, manualDiscountVal), 
        [subTotal, autoDiscountVal, manualDiscountVal]);
    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const [prodRes, caRes, promoRes] = await Promise.all([
                    orderApi.getProducts(),
                    doanhthuApi.getMaCaDangMo(),
                    promoApi.getActivePromos()
                ]);
                
                setProducts(prodRes.data);
                setMaCaOpen(caRes.data.maCa || caRes.data);
                setAllPromos(promoRes.data);
                
                const auto = promoRes.data.find(p => p.configs?.some(c => c.loaiDoiTuong === 'ALL'));
                if (auto) setAutoDiscount(auto);

                const orderRes = await orderApi.loadBan(maBan);
                if (orderRes.data && orderRes.data.items?.length > 0) {
                    const data = orderRes.data;
                    let idTuXuLy = data.maHoaDon || data.items[0].maChiTietHD.split('CTHD')[0];
                    setCart(data.items);
                    setOriginalCart(data.items);
                    setMaHoaDon(idTuXuLy);
                } else {
                    setCart([]);
                    setMaHoaDon(null);
                }
            } catch (err) {
                console.error("Lỗi khởi tạo:", err);
            } finally {
                setLoading(false);
            }
        };
        if (maBan) initData();
    }, [maBan]);
    const filteredProducts = React.useMemo(() => {
            return products
                .filter(p => activeCategory === 'ALL' || p.loai === activeCategory)
                .filter(p => 
                    p.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    p.maSanPham.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }, [products, activeCategory, searchTerm]);
    // const handleConfirmOrder = async (isGoingToPayment = false) => {
    //     if (cart.length === 0) return null;
    //     try {
    //         const orderData = { 
    //             maHoaDon, maBan, maCa: maCaOpen,
    //             items: cart.map(i => ({ maSanPham: i.maSanPham, soLuong: i.soLuong, giaBan: i.giaBan, ghiChu: i.ghiChu || "" })),
    //             tongTien: totalAmount
    //         };
    //         const res = await orderApi.staffCreate(orderData);
    //         const newMaHD = res.data.savedHD?.maHoaDon || res.data.maHoaDon || maHoaDon;
    //         setMaHoaDon(newMaHD);
    //         setOriginalCart([...cart]);
    //         await tableApi.updateTrangThai(maBan, 'PENDING');

    //         if (res.data.printToKitchen?.length > 0) {
    //                 // Duyệt qua danh sách món Bếp trả về, tìm tên từ Giỏ hàng gốc (cart)
    //                 const enrichedKitchenItems = res.data.printToKitchen.map(printItem => {
    //                     // Tìm món tương ứng trong cart để lấy tên
    //                     const itemInCart = cart.find(c => c.maSanPham === printItem.maSanPham);
                        
    //                     return {
    //                         ...printItem,
    //                         // Lấy tên từ cart, nếu không tìm thấy thì mới dùng tên từ Backend (nếu có)
    //                         tenSanPham: itemInCart?.tenSanPham || printItem.tenSanPham || "Món không tên"
    //                     };
    //                 });

    //                 setItemsToPrint(enrichedKitchenItems);
    //                 setIsKitchenSlipOpen(true);
    //             } 
    //             // --- KẾT THÚC ĐOẠN FIX ---
    //             else if (!isGoingToPayment) {
    //                 navigate('/sell');
    //             }
    //         return newMaHD;
    //     } catch (err) { return null; }
    // };
    const handleConfirmOrder = async (isGoingToPayment = false) => {
        if (cart.length === 0) return null;
        try {
            const orderData = { 
                maHoaDon, maBan, maCa: maCaOpen,
                items: cart.map(i => ({ 
                    maSanPham: i.maSanPham, 
                    soLuong: i.soLuong, 
                    giaBan: i.giaBan, 
                    ghiChu: i.ghiChu || "" 
                })),
                tongTien: totalAmount
            };
            
            const res = await orderApi.staffCreate(orderData);
            const newMaHD = res.data.savedHD?.maHoaDon || res.data.maHoaDon || maHoaDon;
            
            await tableApi.updateTrangThai(maBan, 'PENDING');
            
            if (!isGoingToPayment) {
                navigate('/sell');
            }
            return newMaHD;
        } catch (err) { 
            alert("Lỗi khi lưu đơn hàng!");
            return null; 
        }
    };
    const handlePrepareKitchenSlip = () => {
        if (cart.length === 0) {
        alert("Chưa có món nào được chọn! Vui lòng chọn món trước khi báo bếp.");
        return;
    }

        const printItems = [];

        // 1. Tìm món mới hoặc món tăng số lượng
        cart.forEach(item => {
            const oldItem = originalCart.find(o => o.maSanPham === item.maSanPham);
            if (!oldItem) {
                // Món mới hoàn toàn
                printItems.push({ ...item, ghiChu: "MỚI" });
            } else if (item.soLuong > oldItem.soLuong) {
                // Tăng số lượng
                printItems.push({ ...item, soLuong: item.soLuong - oldItem.soLuong, ghiChu: "THÊM" });
            } else if (item.soLuong < oldItem.soLuong) {
                // Giảm số lượng
                printItems.push({ ...item, soLuong: oldItem.soLuong - item.soLuong, ghiChu: "GIẢM/HỦY" });
            }
        });

        // 2. Tìm món bị xóa sạch khỏi giỏ hàng
        originalCart.forEach(oldItem => {
            const stillInCart = cart.find(c => c.maSanPham === oldItem.maSanPham);
            if (!stillInCart) {
                printItems.push({ ...oldItem, ghiChu: "HỦY MÓN" });
            }
        });

        if (printItems.length > 0) {
            setItemsToPrint(printItems);
            setIsKitchenSlipOpen(true);
        } else {
            // Nếu không có gì thay đổi so với DB, chỉ cần lưu hoặc báo thành công
            handleConfirmOrder(false);
        }
};
         const hasCartChanged = () => {
            if (cart.length !== originalCart.length) return true;
            return JSON.stringify(cart) !== JSON.stringify(originalCart);
        };

        // const handleGoToPayment = async () => {
        // const changed = hasCartChanged();

        //     if (changed) {
        //         console.log("🛒 Giỏ hàng có thay đổi -> Lưu rồi mới đi.");
        //         const idMoi = await handleConfirmOrder(true);
        //         if (idMoi) {
        //             navigate(`/payment/${maBan}`, {
        //                 state: { maHoaDon: idMoi, cart, maCa: maCaOpen, totalAmount, subTotal, manualDiscount, autoDiscount }
        //             });
        //         }
        //     } else {
        //         console.log("⚡ Giỏ hàng khớp DB -> Đi thẳng!");
        //         navigate(`/payment/${maBan}`, {
        //             state: { maHoaDon, cart, maCa: maCaOpen, totalAmount, subTotal, manualDiscount, autoDiscount }
        //         });
        //     }
        // };
        const handleGoToPayment = () => {
            // Không check changed, không gọi API. 
            // Cứ bưng nguyên cái giỏ hàng hiện tại đi sang trang Payment.
            
            console.log("🚀 Chuyển sang thanh toán (Giỏ hàng tạm thời)");
            
            navigate(`/payment/${maBan}`, {
                state: { 
                    // maHoaDon: Nếu là bàn cũ thì có ID, bàn mới thì là null
                    maHoaDon, 
                    cart, 
                    maCa: maCaOpen, 
                    totalAmount, 
                    subTotal, 
                    manualDiscount, 
                    autoDiscount 
                }
            });
        };
    const addToCart = (p) => {
        const existing = cart.find(i => i.maSanPham === p.maSanPham);
        if (existing) setCart(cart.map(i => i.maSanPham === p.maSanPham ? { ...i, soLuong: i.soLuong + 1 } : i));
        else setCart([...cart, { ...p, soLuong: 1 }]);
    };

    const categories = [
        { id: 'ALL', name: 'Tất cả' }, { id: 'CAFE', name: 'Cà phê' }, { id: 'TEA', name: 'Trà sữa' }, { id: 'FOOD', name: 'Đồ ăn' }
    ];

    if (loading) return <div className="order-loading">Đang chuẩn bị thực đơn...</div>;
    
    return (
        <div className="order-page-wrapper">
            {/* THỰC ĐƠN BÊN TRÁI */}
            <main className="menu-container">
                <header className="menu-header">
                    <div className="header-title">
                        <h2>Thực đơn gọi món</h2>
                        <p>Bàn đang chọn: <span>{maBan}</span></p>
                    </div>
                    <div className="menu-search">
                        <Search size={18} />
                        <input 
                            type="text" placeholder="Tìm tên món, mã sản phẩm..." 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && <X size={16} className="clear-search" onClick={() => setSearchTerm('')} />}
                    </div>
                </header>

                <CategoryTab 
                    categories={categories} 
                    activeId={activeCategory} 
                    onSelect={setActiveCategory} 
                />

                <div className="product-scroll-area">
                    <div className="product-grid-modern">
                            {filteredProducts.map(p => (
                                <PhanLoaiCard 
                                    key={p.maSanPham}
                                    title={p.tenSanPham}
                                    subtitle={`${p.giaBan.toLocaleString()}đ`}
                                    onClick={() => addToCart(p)}
                                    type="product"
                                />
                            ))
                        }
                    </div>
                </div>
            </main>

            {/* GIỎ HÀNG BÊN PHẢI */}
            <aside className="cart-container">
                <header className="cart-header-modern">
                    <div className="cart-info">
                        <ShoppingCart size={20} />
                        <h3>Chi tiết hóa đơn</h3>
                    </div>
                    <div className="cart-actions-top" ref={menuRef}>
                        <span className="table-label">Bàn {maBan}</span>
                        <button className="btn-more" onClick={() => setShowMenu(!showMenu)}><MoreVertical size={20}/></button>
                        <OrderDropdown 
                            show={showMenu} onClose={() => setShowMenu(false)}
                            onOpenPromo={() => { setIsPromoModalOpen(true); setShowMenu(false); }}
                            onPrintKitchen={() => setIsKitchenSlipOpen(true)}
                        />
                    </div>
                </header>

                <div className="cart-items-area">
                    <CartList 
                        cart={cart} 
                        onRemoveItem={(idx) => {
                            const item = cart[idx];
                            if (!item.maChiTietHD) setCart(prev => prev.filter((_, i) => i !== idx));
                            else setDeleteConfirm({ open: true, index: idx, item });
                        }}
                        onUpdateQty={(idx, qty) => {
                            const newCart = [...cart];
                            newCart[idx].soLuong = qty;
                            setCart(newCart);
                        }}
                        onItemClick={(idx) => { setEditingIdx(idx); setIsNoteModalOpen(true); }}
                    />
                </div>

                <CartFooter 
                    autoDiscount={autoDiscount} autoDiscountVal={autoDiscountVal}
                    manualDiscount={manualDiscount} manualDiscountVal={manualDiscountVal}
                    totalAmount={totalAmount}
                    onConfirm={handlePrepareKitchenSlip}
                    onPayment={handleGoToPayment}
                    onDelete={async () => {
                        const res = await tableApi.getBanTrong(maBan);
                        const status = res.data?.trangThaiThanhToan || res.data?.trangThai;
                        if (status === 'PAID') {
                            setCart([]); setMaHoaDon(null); navigate('/sell');
                        } else alert("Bàn chưa thanh toán!");
                    }}
                />
            </aside>

            {/* CÁC MODAL PHỤ TRỢ (Giữ nguyên component) */}
            <NoteModal isOpen={isNoteModalOpen} item={cart[editingIdx]} onSave={(note) => {
                const newCart = [...cart]; newCart[editingIdx].ghiChu = note; setCart(newCart); setIsNoteModalOpen(false);
            }} onClose={() => setIsNoteModalOpen(false)} />
            
            <ConfirmDeleteModal isOpen={deleteConfirm.open} itemName={deleteConfirm.item?.tenSanPham} 
                onCancel={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={async () => {
                    await orderApi.removeOrderItem(deleteConfirm.item.maChiTietHD);
                    setCart(prev => prev.filter((_, i) => i !== deleteConfirm.index));
                    setDeleteConfirm({ open: false, index: null, item: null });
                }} 
            />

            <PromotionModal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} promos={allPromos.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'SELECTIVE'))}
                onSelect={(p) => { setManualDiscount(p); setIsPromoModalOpen(false); }} />

            <KitchenSlipModal 
            isOpen={isKitchenSlipOpen} 
            onClose={() => setIsKitchenSlipOpen(false)} maBan={maBan} cart={itemsToPrint}
            onConfirm={async () => { 
                await handleConfirmOrder(false);
                setIsKitchenSlipOpen(false); 
            }} />
        </div>
    );
};

export default OrderPage;