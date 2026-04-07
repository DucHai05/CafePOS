import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { orderApi } from '../../api/orderAPI';
import { promoApi } from '../../api/promotionAPI';
import { tableApi } from '../../api/tableAPI';
import { doanhthuApi } from '../../api/doanhthuAPI'; 
import PhanLoaiCard from '../../components/Common/PhanLoaiCard'; // Import component dùng chung
import CategoryTab from '../../components/Common/CategoryTab';
import KitchenSlipModal from '../../components/Common/KitchenSlipModal';
import ReceiptModal from '../../components/Common/ReceiptModal';
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

    // --- 1. STATE DỮ LIỆU ---
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [allPromos, setAllPromos] = useState([]);

    // --- 2. STATE UI (MODALS) ---
    const [showMenu, setShowMenu] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false); 
    const [isKitchenSlipOpen, setIsKitchenSlipOpen] = useState(false);

    // --- 3. STATE KHUYẾN MÃI ---
    const [autoDiscount, setAutoDiscount] = useState(null);
    const [manualDiscount, setManualDiscount] = useState(null);
    const [availablePromos, setAvailablePromos] = useState([]);

    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [editingIdx, setEditingIdx] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, index: null, item: null });
    const [maHoaDon, setMaHoaDon] = useState(null); // Lưu mã HD ở đây
    const getKhuVuc = (ma) => {
        if (!ma) return "Chưa xác định";
        return `Khu ${ma.charAt(0).toUpperCase()}`;
    };
    const [itemsToPrint, setItemsToPrint] = useState([]); // Lưu những gì thực sự cần in (Thêm/Hủy)


    // --- 5. TÍNH TOÁN TIỀN ---
    const subTotal = CartHelpers.calculateSubTotal(cart);
    const autoDiscountVal = CartHelpers.calculateDiscountValue(autoDiscount, subTotal);
    const manualDiscountVal = CartHelpers.calculateDiscountValue(manualDiscount, subTotal);
    const totalAmount = CartHelpers.calculateFinalTotal(subTotal, autoDiscountVal, manualDiscountVal);


    const [searchTerm, setSearchTerm] = useState(''); // State lưu chữ tìm kiếm
    const handleRemoveItem = (index) => {
            const item = cart[index];

            // TRƯỜNG HỢP 1: Món mới thêm vào giỏ (chưa ấn Xác nhận)
            if (!item.maChiTietHD) {
                setCart(prev => prev.filter((_, i) => i !== index));
                return;
            }

            // TRƯỜNG HỢP 2: Món đã có trong Database (Đã ấn xác nhận trước đó)
            setDeleteConfirm({ open: true, index: index, item: item });
        };

    const confirmDeleteFromDB = async () => {
        try {
            const { item, index } = deleteConfirm;
            // Gọi API xóa món ở Backend
            await orderApi.removeOrderItem(item.maChiTietHD);
            
            // Cập nhật UI: Xóa khỏi mảng cart
            setCart(prev => prev.filter((_, i) => i !== index));
            setDeleteConfirm({ open: false, index: null, item: null });
            
            alert("Đã hủy món thành công!");
        } catch (err) {
            alert("Lỗi khi hủy món: " + err.message);
        }
    };   

    const handleUpdateQty = (index, newQty) => {
        const newCart = [...cart];
        newCart[index].soLuong = newQty;
        setCart(newCart);
    };

    const [maCaOpen, setMaCaOpen] = useState('');
    useEffect(() => {
        const fetchMaCa = async () => {
            try {
                const response = await doanhthuApi.getMaCaDangMo();
                console.log("Mã ca đang mở:", response.data);
                setMaCaOpen(response.data); // Gán mã ca vào biến
            } catch (error) {
                console.error("Không lấy được mã ca:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMaCa();
    }, []);

   const handleConfirmOrder = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống!");
            return;
        }
        if (!maCaOpen || maCaOpen === "NONE") {
                    alert("⚠️ Lỗi: Hiện tại chưa có ca làm việc nào được mở. Vui lòng mở ca trước!");
                    return;
                }
        try {
            // 1. Chuẩn bị dữ liệu gửi đi
            const orderData = { 
                maHoaDon: maHoaDon, // Nếu có thì gửi để Backend biết là Update
                maBan: maBan, 
                maCa: maCaOpen ,
                items: cart.map(item => ({
                    maSanPham: item.maSanPham,
                    soLuong: item.soLuong,
                    giaBan: item.giaBan,
                    ghiChu: item.ghiChu || ""
                    
                })),
                tongTien: totalAmount
            };

            // 2. GỌI API DUY NHẤT: Lưu đơn và nhận danh sách in bếp
            console.log(">>> Đang gửi đơn hàng lên hệ thống...");
            console.log(">>> Maca đang gửi lên hệ thống...", maCaOpen);
            const response = await orderApi.staffCreate(orderData);
            
            // 3. Cập nhật các thông tin trả về từ Backend
            const { savedHD, printToKitchen } = response.data; // Giả sử Backend trả về Map như nãy mình viết
            
            // Cập nhật lại mã hóa đơn để đồng bộ state
            if (savedHD) setMaHoaDon(savedHD.maHoaDon);

            // 4. Đổi trạng thái bàn sang PENDING (Service 8083)
            await tableApi.updateTrangThai(maBan, 'PENDING');

            // 5. Kiểm tra và hiện Modal in bếp
            if (printToKitchen && printToKitchen.length > 0) {
                setItemsToPrint(printToKitchen);
                setIsKitchenSlipOpen(true); // Mở Modal để nhân viên xem lại phiếu in
            } else {
                // Nếu không có gì để in (vô lý nhưng cứ phòng xa) thì về sơ đồ luôn
                alert("Đã lưu đơn thành công!");
                navigate('/sell');
            }

        } catch (err) {
            console.error(">>> LỖI XÁC NHẬN ĐƠN:", err);
            const errorMsg = err.response?.data?.message || "Lỗi kết nối đến máy chủ!";
            alert("Không thể lưu đơn: " + errorMsg);
        }
    };
   
    const handleSaveNote = (newNote) => {
        const newCart = [...cart];
        newCart[editingIdx].ghiChu = newNote;
        setCart(newCart);
        setIsNoteModalOpen(false);
        };
 
    useEffect(() => {
        const fetchCurrentOrder = async () => {
            try {
                // Gọi API tìm hóa đơn chưa thanh toán của bàn này
                const res = await orderApi.loadBan(maBan);
                if (res.data) {
                    setCurrentOrderId(res.data.maHoaDon); // Lưu ID hóa đơn hiện tại
                    setOrderedItems(res.data.items);     // (Tùy chọn) Hiển thị các món cũ cho nhân viên xem
                }
            } catch (err) {
                console.log("Bàn trống hoặc chưa có hóa đơn cũ");
                setCurrentOrderId(null);
            }
        };
        fetchCurrentOrder();
    }, [maBan]);


    useEffect(() => {
            // 1. Lấy sản phẩm
            orderApi.getProducts()
                .then(res => setProducts(res.data))
                .catch(err => console.error("Lỗi lấy sản phẩm:", err));

            // 2. Lấy thông tin bàn
            orderApi.loadBan(maBan)
                .then(res => {
                    if (res.data) {
                        // TRƯỜNG HỢP BÀN ĐỎ: Có dữ liệu
                        setCart(res.data.items || []);
                        setMaHoaDon(res.data.maHoaDon);
                    } else {
                        // TRƯỜNG HỢP BÀN XANH: res.data là null
                        setCart([]);
                        setMaHoaDon(null);
                        console.log("Bàn trống, sẵn sàng tạo đơn mới!");
                    }
                })
                .catch(err => {
                    // Nếu có lỗi thật sự (như rớt mạng) thì mới báo lỗi
                    console.error("Lỗi kết nối:", err);
                    setCart([]);
                    setMaHoaDon(null);
                });

            // 3. Lấy khuyến mãi
            const fetchPromos = async () => {
                try {
                    const res = await promoApi.getActivePromos();
                    setAllPromos(res.data);
                    // Tìm KM tự động
                    const auto = res.data.find(p => p.configs?.some(c => c.loaiDoiTuong === 'ALL'));
                    if (auto) setAutoDiscount(auto);
                } catch (err) {
                    console.error("Lỗi lấy KM:", err);
                }
            };
            fetchPromos();



        }, [maBan]);

    const getTableEmpty = async () => {
            try {
                const res = await tableApi.getBanTrong(maBan);
                console.log("Dữ liệu thực tế từ API:", res.data); // <--- SOI KỸ TÊN CỘT Ở ĐÂY
                // Dùng ?. để an toàn nếu res.data không tồn tại
                const status = res.data?.trangThaiThanhToan || res.data?.trangThai;
                console.log("Trạng thái:", status); 

                if (status === 'PAID') {
                    // Thông báo rõ ràng là dọn bàn thành công
                    alert(`Dọn bàn ${maBan} thành công! Hệ thống đã giải phóng bàn.`);
                    
                    setCart([]);
                    setMaHoaDon(null); // Nên dọn luôn cả mã hóa đơn cũ trong state
                    navigate('/sell');
                } else {
                    // Báo cho nhân viên biết lý do không thoát được
                    alert(`Bàn ${maBan} vẫn đang có đơn chưa thanh toán. Vui lòng kiểm tra lại!`);
                }
            } catch (err) {
                console.error("Lỗi lấy trạng thái bàn:", err);
                alert("Không thể kết nối máy chủ để kiểm tra trạng thái bàn.");
            }
        };
          

        useEffect(() => {
            const handleOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
            document.addEventListener('mousedown', handleOutside);
            return () => document.removeEventListener('mousedown', handleOutside);
        }, []);
        // --- 7. HANDLERS ---
        const addToCart = (p) => {
            const existing = cart.find(i => i.maSanPham === p.maSanPham);
            if (existing) {
                setCart(cart.map(i => i.maSanPham === p.maSanPham ? { ...i, soLuong: i.soLuong + 1 } : i));
            } else {
                setCart([...cart, { ...p, soLuong: 1 }]);
            }
        };

        const openPromoModal = () => {
            const selectiveList = allPromos.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'SELECTIVE'));
            setAvailablePromos(selectiveList);
            setIsPromoModalOpen(true);
            setShowMenu(false);
        };
    
   // --- 7. HANDLERS (HÀM CHỐT THANH TOÁN) ---
    const handlePaymentConfirm = async (method) => {
    console.log(">>> Bắt đầu luồng thanh toán SIÊU TỐC...");

    // 1. CHẶN LỖI: Kiểm tra xem đã lấy được mã ca chưa
    if (!maCaOpen || maCaOpen === "NONE" || maCaOpen === "undefined") {
        alert("⚠️ Lỗi: Chưa lấy được mã ca làm việc. Vui lòng chờ 1 giây hoặc tải lại trang!");
        return;
    }

    try {
        // 2. CHUẨN BỊ orderData (Đảm bảo có maCa)
        const orderData = {
            maHoaDon: maHoaDon, 
            maBan: maBan,
            maCa: maCaOpen, // <--- Cực kỳ quan trọng
            items: cart.map(item => ({
                maSanPham: item.maSanPham,
                soLuong: item.soLuong,
                giaBan: item.giaBan,
                ghiChu: item.ghiChu || ""
            })),
            tongTien: totalAmount
        };

        // 3. BƯỚC ĐỆM: Lưu/Cập nhật hóa đơn trước khi chốt tiền
        // Việc này đảm bảo maCa được ghi vào bảng HoaDon ở port 8081
        console.log(">>> Đang lưu hóa đơn với mã ca:", maCaOpen);
        const createRes = await orderApi.staffCreate(orderData);
        
        // Lấy mã HD chính xác từ server trả về
        const currentMaHD = createRes.data.hoaDon ? createRes.data.hoaDon.maHoaDon : createRes.data.maHoaDon;
        setMaHoaDon(currentMaHD);

        // 4. CHỐT THANH TOÁN (Hóa đơn sang trạng thái PAID)
        const paymentPayload = {
            maHoaDon: currentMaHD,
            maBan: maBan,
            phuongThucThanhToan: method,
            maKhuyenMai: manualDiscount?.maKhuyenMai || autoDiscount?.maKhuyenMai || null,
            tongTienSauKM: totalAmount,
            thoiGianThanhToan: new Date().toISOString(),
            trangThaiThanhToan: 'Paid',
            tongTienGoc: subTotal,
            nhanVienThucHien: 'Hải POS'
        };

        console.log(">>> Đang gửi lệnh chốt thanh toán...");
        const payRes = await orderApi.finalPayment(paymentPayload);

        // 5. CẬP NHẬT DOANH THU (Service 8084)
        // Dùng biến maCaOpen trực tiếp để chắc chắn không bị undefined
        console.log(">>> Đang cộng tiền vào doanh thu ca:", maCaOpen);
        await doanhthuApi.updateAfterPayment(maCaOpen, method, totalAmount);

        if (payRes.status === 200 || payRes.status === 201) {
            // 6. GIẢI PHÓNG BÀN (Màu xanh)
            await tableApi.updateTrangThai(maBan, 'PAID');
            
            alert(`Thanh toán SIÊU TỐC thành công! Mã đơn: ${currentMaHD}`);
            
            setIsReceiptOpen(false);
            setCart([]);
            navigate('/sell');
        }

    } catch (err) {
        console.error(">>> LỖI COMBO THANH TOÁN:", err);
        const errorMsg = err.response?.data?.message || "Lỗi hệ thống khi xử lý thanh toán!";
        alert("Thanh toán thất bại: " + errorMsg);
    }
    };

    
    const categories = [
        { id: 'ALL', name: 'Tất cả' }, { id: 'CAFE', name: 'Cà phê' }, { id: 'TEA', name: 'Trà sữa' }, { id: 'FOOD', name: 'Đồ ăn' }
    ];

    return (
        <div className="order-container">
            {/* THỰC ĐƠN */}
            <div className="menu-section">
                <div className="section-header"><h2>Thực đơn</h2></div>
                <div className="search-box">
                {/* Icon tìm kiếm */}
                <span className="search-icon">🔍</span> 
                <input 
                    type="text" 
                    placeholder="Tìm món nhanh (tên, mã...)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi gõ
                />
                {/* Nút xóa nhanh nếu có chữ */}
                {searchTerm && (
                    <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
                )}
            </div>
                <CategoryTab 
                    categories={categories} 
                    activeId={activeCategory} 
                    onSelect={setActiveCategory} 
                />
                <div className="product-grid">
                    {products
                        .filter(p => activeCategory === 'ALL' || p.loai === activeCategory) // Lọc theo loại
                        .filter(p => 
                            p.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) || // Lọc theo tên
                            p.maSanPham.toLowerCase().includes(searchTerm.toLowerCase())    // Lọc theo mã (nếu muốn)
                        )
                        .map(p => (
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

            {/* GIỎ HÀNG */}
            <div className="cart-section">
                <div className="cart-header">

                    <div className="extra-menu-container" ref={menuRef}>
                        <button className="dots-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>

                        <OrderDropdown 
                            show={showMenu}
                            onClose={() => setShowMenu(false)}
                            onOpenPromo={openPromoModal}
                            onPrintKitchen={() => setIsKitchenSlipOpen(true)}
                            onOpenOrderNote={() => console.log("Mở ghi chú đơn...")}
                        />
                    </div>

                    <h3>Chi tiết hóa đơn</h3>
                    <span className="table-badge">Bàn: {maBan}</span>
                </div>

                <CartList 
                    cart={cart} 
                    onRemoveItem={handleRemoveItem}
                    onUpdateQty={handleUpdateQty}
                    onItemClick={(idx) => { setEditingIdx(idx); setIsNoteModalOpen(true); }}
                />

                <NoteModal 
                    isOpen={isNoteModalOpen}
                    item={cart[editingIdx]}
                    onSave={handleSaveNote}
                    onClose={() => setIsNoteModalOpen(false)}
                />
                <CartFooter 
                    autoDiscount={autoDiscount}
                    autoDiscountVal={autoDiscountVal}
                    manualDiscount={manualDiscount}
                    manualDiscountVal={manualDiscountVal}
                    totalAmount={totalAmount}
                    onConfirm={handleConfirmOrder}
                    onPayment={() => setIsReceiptOpen(true)}
                    onMerge={() => console.log("Gộp bàn logic...")} // Hải thêm logic sau
                    onDelete={getTableEmpty}
                />


                </div>
                <ConfirmDeleteModal 
                    isOpen={deleteConfirm.open}
                    itemName={deleteConfirm.item?.tenSanPham}
                    onCancel={() => setDeleteConfirm({ open: false, item: null })}
                    onConfirm={confirmDeleteFromDB} // Hàm gọi API xóa ở Backend
                />       
                <PromotionModal 
                        isOpen={isPromoModalOpen}
                        onClose={() => setIsPromoModalOpen(false)}
                        promos={availablePromos}
                        onSelect={(p) => {
                            setManualDiscount(p);
                            setIsPromoModalOpen(false);
                        }}
                    />

                <KitchenSlipModal 
                    isOpen={isKitchenSlipOpen}
                    onClose={() => setIsKitchenSlipOpen(false)}
                    maBan={maBan}
                    khuVuc={getKhuVuc(maBan)}
                    cart={itemsToPrint}
                    onConfirm={() => {
                        handleConfirmOrder(false);
                        setCart([]); // Xóa giỏ hàng local
                        navigate('/sell');
                    }}
                />
                <ReceiptModal 
                    isOpen={isReceiptOpen}
                    onClose={() => setIsReceiptOpen(false)}
                    maBan={maBan}
                    cart={cart}
                    subTotal={subTotal}
                    autoDiscount={autoDiscount}
                    autoDiscountVal={autoDiscountVal}
                    manualDiscount={manualDiscount}
                    manualDiscountVal={manualDiscountVal}
                    totalAmount={totalAmount}
                    // GẮN HÀM MỚI VÀO ĐÂY
                    onConfirm={handlePaymentConfirm} 
                />


        </div>
    );
};

export default OrderPage;
