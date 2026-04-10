import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TableProperties, 
  ClipboardList, 
  History, 
  Settings, 
  LogOut,
  Bell,
  UserCircle
} from 'lucide-react';
import './MainLayout.css';
import ladoLogo from '../assets/LADO.png';
const MainLayout = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const formatTime = () =>
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

    setCurrentTime(formatTime());
    const timer = setInterval(() => setCurrentTime(formatTime()), 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pos-app">
      <aside className="pos-sidebar">
        <div className="brand">
          <div className="logo-box">
            <img src={ladoLogo} alt="Lado Coffee Logo" className="logo-img" />
        </div>
        </div>

        <nav className="nav-group">
          <label>Vận hành</label>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/sell" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <TableProperties size={20} /> <span>Bán hàng</span>
          </NavLink>
          <NavLink to="/cham-cong" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <TableProperties size={20} /> <span>Chấm công</span>
          </NavLink>
        </nav>

        <nav className="nav-group">
          <label>Quản lý</label>
          <NavLink to="/discount" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <ClipboardList size={20} /> <span>Khuyến mãi</span>
          </NavLink>
          <NavLink to="/table-map" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <TableProperties size={20} /> <span>Bàn & Khu vực</span>
          </NavLink>
          <NavLink to="/doanh-thu" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <ClipboardList size={20} /> <span>Doanh thu</span>
          </NavLink>
          <NavLink to="/ca" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <History size={20} /> <span>Ca làm việc</span>
          </NavLink>
          <NavLink to="/nhan-su" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <History size={20} /> <span>Nhân sự</span>
          </NavLink>
          <NavLink to="/salary" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} /> <span>Lương/ Thưởng</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" onClick={() => navigate('/profile')} >
            <UserCircle size={32} color="#4f46e5" strokeWidth={1.5} />
            <div className="user-meta">
              <p className="user-name">Bùi Đức Hải</p>
              <p className="user-role">Quản lý hệ thống</p>
            </div>
          </div>
          
          <button className="logout-btn" onClick={() => navigate('/login')}>
            <LogOut size={18} /> <span>Kết thúc ca</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT (GIỮ NGUYÊN) */}
      <main className="pos-main">
        <header className="pos-topbar">
          <div className="topbar-actions">
            <div className="status-indicator">
              <span className="dot online"></span>
              Server Online
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="time-display">{currentTime}</div>
          </div>
        </header>
        
        <section className="pos-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
