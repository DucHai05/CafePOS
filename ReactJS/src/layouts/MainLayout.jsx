import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TableProperties, 
  ClipboardList, 
  History, 
  Settings, 
  LogOut,
  Bell,
  Search,
  UserCircle
} from 'lucide-react'; // Sử dụng thư viện icon lucide-react cho hiện đại
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="pos-app">
      {/* SIDEBAR */}
      <aside className="pos-sidebar">
        <div className="brand">
          <div className="logo-box">H</div>
          <span>HAI POS</span>
        </div>

        <nav className="nav-group">
          <label>VẬN HÀNH</label>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/sell" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <TableProperties size={20} /> <span>Bán hàng</span>
          </NavLink>
        </nav>

        <nav className="nav-group">
          <label>QUẢN LÝ</label>
          <NavLink to="/history" className="nav-item">
            <History size={20} /> <span>Lịch sử hóa đơn</span>
          </NavLink>
          <NavLink to="/discount" className="nav-item">
            <ClipboardList size={20} /> <span>Khuyến mãi</span>
          </NavLink>
          <NavLink to="/table-map" className="nav-item">
            <ClipboardList size={20} /> <span>Quản lý bàn/ khu vực</span>
          </NavLink>
          <NavLink to="/doanh-thu" className="nav-item">
            <ClipboardList size={20} /> <span>Quản lý doanh thu</span>
          </NavLink>
          <NavLink to="/ca" className="nav-item">
            <ClipboardList size={20} /> <span>Quản lý ca</span>
          </NavLink>
          <NavLink to="/settings" className="nav-item">
            <Settings size={20} /> <span>Cấu hình</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <UserCircle size={32} color="#94a3b8" />
            <div className="user-meta">
              <p className="user-name">Hải Admin</p>
              <p className="user-role">Quản lý ca</p>
            </div>
          </div>
          <button className="logout-btn" onClick={() => navigate('/login')}>
            <LogOut size={18} /> <span>Kết ca</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="pos-main">
        <header className="pos-topbar">

          
          <div className="topbar-actions">
            <div className="status-indicator">
              <span className="dot online"></span>
              Server Online
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="time-display">03:22 AM</div>
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