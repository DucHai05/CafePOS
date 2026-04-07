import React, { useState } from 'react'; // 1. PHẢI thêm useState ở đây
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import OrderPage from './pages/OrderPage/orderPage';
import TableMapPage from './pages/OrderTableMap/tableMapPage';
import PromotionPage from './pages/Promotion/PromotionPage';
import DoanhThuPage from './pages/DoanhThu/DoanhThuList';
import CaPage from './pages/Ca/CaManager';
import KhuVucManager from './pages/KhuVuc/KhuVucManager';
import BanPage from './pages/Ban/BanManager';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import Dashboard from './pages/DashboardPage/DashboardPage';


// 2. Định nghĩa lại TableManager với Logic State
const TableManager = () => {
  // Tạo state để giữ khu vực đang chọn
  const [selectedKhuVuc, setSelectedKhuVuc] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>📂 Quản lý Khu Vực</h3>
        {/* Truyền hàm setSelectedKhuVuc vào prop onSelectKhuVuc */}
        <KhuVucManager onSelectKhuVuc={setSelectedKhuVuc} />
      </section>
      
      <section style={sectionStyle}>
        <h3 style={titleStyle}>
          🪑 Quản lý Danh sách Bàn 
          {selectedKhuVuc && <span style={{color: '#1890ff'}}> - {selectedKhuVuc.tenKhuVuc}</span>}
        </h3>
        
        {/* Logic hiển thị: Có chọn mới hiện BanPage, chưa chọn hiện thông báo */}
        {selectedKhuVuc ? (
          <BanPage khuVuc={selectedKhuVuc} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999', border: '2px dashed #ccc', borderRadius: '8px' }}>
             <h4>Vui lòng chọn một khu vực bên trên để quản lý bàn</h4>
          </div>
        )}
      </section>
    </div>
  );
};



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sell" element={<TableMapPage />} />
          <Route path="/discount" element={<PromotionPage />} />
          <Route path="/ca" element={<CaPage />} />
          <Route path="/doanh-thu" element={<DoanhThuPage />} />
          <Route path="/order/:maBan" element={<OrderPage />} />
          <Route path="/table-map" element={<TableManager />} />
          <Route path="/payment/:maBan" element={<PaymentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Styles (Giữ nguyên của bạn)
const statsGrid = { display: 'flex', gap: '20px', marginTop: '20px' };
const statCard = { padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1 };
const sectionStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' };
const titleStyle = { marginBottom: '15px', color: '#333', borderLeft: '4px solid #1890ff', paddingLeft: '10px' };

export default App;