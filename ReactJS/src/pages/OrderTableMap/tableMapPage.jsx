import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableApi } from '../../api/tableAPI';
import TableCard from '../../components/TableCard/TableCard'; 
import CategoryTab from '../../components/Common/CategoryTab';
import { Layout, Info } from 'lucide-react'; // Icon cho sinh động
import './tableMapPage.css';

const TableMapPage = () => {
    const [tables, setTables] = useState([]); 
    const [categories, setCategories] = useState([{ id: 'ALL', name: 'Tất cả khu vực' }]); 
    const [activeCategory, setActiveCategory] = useState('ALL');
    const navigate = useNavigate();

  

    // --- 2. LẤY DỮ LIỆU ---
    useEffect(() => {
        // Lấy bàn
        tableApi.getTables()
            .then(res => setTables(res.data))
            .catch(err => console.error(err));

        // Lấy khu vực
        tableApi.getKhuVuc()
            .then(res => {
                const apiCategories = res.data.map(kv => ({
                    id: kv.maKhuVuc,
                    name: kv.tenKhuVuc
                }));
                setCategories([{ id: 'ALL', name: 'Tất cả khu vực' }, ...apiCategories]);
            })
            .catch(err => console.error(err));
    }, []);

    const handleTableClick = (table) => navigate(`/order/${table.maBan}`);

    const filteredTables = tables.filter(t => {
        if (activeCategory === 'ALL') return true;
        const tableKV = t.maKhuVuc || t.khuVuc?.maKhuVuc || t.makhuvuc;
        return String(tableKV || "").trim() === String(activeCategory || "").trim();
    });

    return (
        <div className="table-map-wrapper">
            <header className="map-header">
                <div className="header-info">
                    <h1>Sơ đồ bàn</h1>
                    <p>Trạng thái phục vụ thời gian thực</p>
                </div>
                <div className="map-legend">
                    <div className="legend-item"><span className="dot empty"></span> Trống</div>
                    <div className="legend-item"><span className="dot busy"></span> Có khách</div>
                    <div className="legend-item"><span className="dot pending"></span> Chờ thanh toán</div>
                </div>
            </header>

            <div className="filter-section">
                <CategoryTab 
                    categories={categories} 
                    activeId={activeCategory} 
                    onSelect={setActiveCategory} 
                />
            </div>

            <div className="table-grid-modern">
                {filteredTables.length === 0 ? (
                    <div className="empty-state-map">
                        <Layout size={48} color="#cbd5e1" />
                        <p>Khu vực này hiện chưa có bàn nào được thiết lập.</p>
                    </div>
                ) : (
                    filteredTables.map(item => (
                        <TableCard
                            key={item.maBan}
                            table={item}
                            onClick={() => handleTableClick(item)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TableMapPage;