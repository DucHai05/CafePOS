import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableApi } from '../../api/tableAPI';
import TableCard from '../../components/TableCard/TableCard'; 
import CategoryTab from '../../components/Common/CategoryTab';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './tableMapPage.css';

const TableMapPage = () => {
    const [tables, setTables] = useState([]); 
    const [categories, setCategories] = useState([{ id: 'ALL', name: 'Tất cả' }]); // State cho khu vực
    const [activeCategory, setActiveCategory] = useState('ALL');
    const navigate = useNavigate();

    // --- 1. KẾT NỐI REAL-TIME (WEBSOCKET) ---
    useEffect(() => {
        // Lưu ý: Kiểm tra port 8083 hoặc 8081 cho đúng với Backend của bạn
        const socket = new SockJS('http://localhost:8083/ws-coffee');
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; // Tắt log rác

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/tables', (message) => {
                const maBanVuaThanhToan = message.body;
                setTables(prev => prev.map(t => 
                    t.maBan === maBanVuaThanhToan ? { ...t, trangThai: 'EMPTY' } : t
                ));
            });
        });

        return () => { if(stompClient) stompClient.disconnect(); };
    }, []);

    // --- 2. LẤY DỮ LIỆU BÀN ---
    useEffect(() => {
        tableApi.getTables()
            .then(res => setTables(res.data))
            .catch(err => console.error("Lỗi lấy bàn:", err));
    }, []);

    // --- 3. LẤY DỮ LIỆU KHU VỰC ---
    useEffect(() => {
        tableApi.getKhuVuc()
            .then(res => {
                // Giả sử API trả về mảng [{maKhuVuc: 'KV1', tenKhuVuc: 'Tầng 1'}, ...]
                const apiCategories = res.data.map(kv => ({
                    id: kv.maKhuVuc, // Map maKhuVuc vào id
                    name: kv.tenKhuVuc // Map tenKhuVuc vào name
                }));
                
                // Gộp với option "Tất cả" mặc định
                setCategories([{ id: 'ALL', name: 'Tất cả' }, ...apiCategories]);
            })
            .catch(err => console.error("Lỗi lấy khu vực:", err));
    }, []);

    // --- 4. XỬ LÝ CLICK ---
    const handleTableClick = (table) => {
        navigate(`/order/${table.maBan}`);
    };

    // --- 5. LOGIC LỌC BÀN THEO KHU VỰC ---
    const filteredTables = tables.filter(t => {
        // 1. Nếu chọn "Tất cả", cho qua luôn
        if (activeCategory === 'ALL') return true;

        const tableKV = t.maKhuVuc || t.khuVuc?.maKhuVuc || t.makhuvuc;

        // 3. So sánh sau khi đã xóa khoảng trắng (trim)
        return String(tableKV || "").trim() === String(activeCategory || "").trim();
    });


    return (
        <div className="table-grid-container" style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Sơ đồ bàn</h2>
            
            {/* Truyền categories từ State vào đây */}
            <CategoryTab 
                categories={categories} 
                activeId={activeCategory} 
                onSelect={setActiveCategory} 
            />



            <div className="table-grid">
                {filteredTables.map(item => (
                    <TableCard
                        key={item.maBan}
                        table={item}
                        onClick={() => handleTableClick(item)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TableMapPage;