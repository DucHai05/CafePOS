import React, { useState } from 'react';
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
import LoginPage from './pages/Auth/LoginPage';
import Register from './pages/Auth/RegisterPage';
import ForgotPassword from './pages/Auth/ForgotPasswordPage';
import EmployeeManagement from './pages/Auth/EmployeeManagementPage';
import Profile from './pages/Auth/ProfilePage';

// import ChamCong from './pages/Auth/ChamCongPage';
// import LuongThuong from './pages/Auth/LuongThuongPage';
// import Profile from './pages/Auth/ProfilePage';

const TableManager = () => {
  const [selectedKhuVuc, setSelectedKhuVuc] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>📂 Quản lý Khu Vực</h3>
        <KhuVucManager onSelectKhuVuc={setSelectedKhuVuc} />
      </section>
      
      <section style={sectionStyle}>
        <h3 style={titleStyle}>
          🪑 Quản lý Danh sách Bàn 
          {selectedKhuVuc && <span style={{color: '#1890ff'}}> - {selectedKhuVuc.tenKhuVuc}</span>}
        </h3>
        
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
        {/* 1. Mặc định vào trang web sẽ tự động chuyển hướng sang /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 2. Trang Login nằm ĐỘC LẬP, không bị bọc bởi MainLayout */}
        <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

        {/* 3. MainLayout chỉ bọc các trang sau khi đã đăng nhập */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sell" element={<TableMapPage />} />
          <Route path="/discount" element={<PromotionPage />} />
          <Route path="/ca" element={<CaPage />} />
          <Route path="/doanh-thu" element={<DoanhThuPage />} />
          <Route path="/order/:maBan" element={<OrderPage />} />
          <Route path="/table-map" element={<TableManager />} />
          <Route path="/payment/:maBan" element={<PaymentPage />} />
          <Route path="/nhan-su" element={<EmployeeManagement />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/cham-cong" element={<ChamCong />} />
          <Route path="/tinh-luong" element={<LuongThuong />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

const statsGrid = { display: 'flex', gap: '20px', marginTop: '20px' };
const statCard = { padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1 };
const sectionStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' };
const titleStyle = { marginBottom: '15px', color: '#333', borderLeft: '4px solid #1890ff', paddingLeft: '10px' };

export default App;