import React, { useState } from 'react';
import { DollarSign, ShoppingBag, Ticket, Target, Star, ChevronLeft, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';
import './dashboardpage.css';
import promo1 from '../../assets/promo.jpg';
import promo2 from '../../assets/promo2.png';
import promo3 from '../../assets/promo3.webp';

const Dashboard = () => {
   const banners = [
        // 2. Truyền biến đã import vào đây (không để trong dấu ngoặc kép)
        { id: 1, img: promo1, title: 'Coffee Day - Giảm 20%' },
        { id: 2, img: promo2, title: 'Ra mắt Trà Sữa Oolong Mới' },
        { id: 3, img: promo3, title: 'Thi đua Nhân viên xuất sắc' }
    ];
    const [currentBanner, setCurrentBanner] = useState(0);

    // Giả lập dữ liệu Doanh thu & Khuyến mãi
    const stats = [
        { id: 1, icon: DollarSign, label: 'Doanh thu hôm nay', value: '1,250,000đ', trend: '+15%', color: 'indigo' },
        { id: 2, icon: ShoppingBag, label: 'Đơn hàng mới', value: '45 đơn', trend: '+8%', color: 'blue' },
        { id: 3, icon: Ticket, label: 'Voucher đã dùng', value: '12 mã', trend: '-2%', color: 'rose' },
        { id: 4, icon: Target, label: 'Hiệu suất mục tiêu', value: '85%', trend: '+5%', color: 'emerald' }
    ];

    const currentPromos = [
        { id: 1, name: 'Happy Hour - Giảm 10%', time: '14h - 17h', usage: '25/100' },
        { id: 2, name: 'Voucher Khách mới', time: '30/04/2024', usage: '12/50' },
        { id: 3, name: 'Combo Đồ ăn sáng', time: '5h - 10h', usage: '45 đơn' },
    ];

    // Giả lập dữ liệu biểu đồ cột (Tuần này)
    const chartData = [
        { day: 'T2', value: 850 }, { day: 'T3', value: 920 }, { day: 'T4', value: 1100 }, 
        { day: 'T5', value: 1050 }, { day: 'T6', value: 1300 }, { day: 'T7', value: 1600 }, 
        { day: 'CN', value: 1450 }
    ];
    const maxVal = Math.max(...chartData.map(d => d.value));

    return (
        <div className="dashboard-wrapper">
            <header className="dash-header">
                <div className="header-title-main">
                    <h1>Lado Coffee</h1>
                    <p>Chào bạn, chúc bạn một ngày buôn bán thuận lợi!</p>
                </div>
                <TrendingUp className="header-trend-icon" size={32} />
            </header>

            {/* 1. BANNER CHẠY NGANG (Carousel) */}
            <section className="banner-carousel-section">
                <div className="carousel-track" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                    {banners.map((b) => (
                        <div key={b.id} className="carousel-item">
                            <img src={b.img} alt={b.title} />
                            <div className="banner-title-card">
                                <h2>{b.title}</h2>
                                <button className="banner-action-btn">Chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-nav prev" onClick={() => setCurrentBanner((currentBanner - 1 + banners.length) % banners.length)}><ChevronLeft size={24} /></button>
                <button className="carousel-nav next" onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)}><ChevronRight size={24} /></button>
            </section>

            {/* 2. THẺ THỐNG KÊ (Stats Cards) */}
            <section className="stats-cards-section">
                {stats.map((s) => {
                    const Icon = s.icon;
                    const isPositive = s.trend.startsWith('+');
                    return (
                        <div key={s.id} className="stat-card">
                            <div className={`stat-icon-box bg-${s.color}`}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-info-main">
                                <h3>{s.value}</h3>
                                <p>{s.label}</p>
                                <span className={`stat-trend-tag ${isPositive ? 'trend-up' : 'trend-down'}`}>
                                    {s.trend}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </section>

            <div className="dash-bottom-grid">
                {/* 3. BIỂU ĐỒ CỘT DOANH THU (Bar Chart) */}
                <section className="revenue-chart-section modern-card">
                    <div className="card-header">
                        <h2><BarChart3 size={20}/> Thống kê Doanh thu Tuần này (1.000đ)</h2>
                        <select className="modern-select"><option>Tuần này</option><option>Tháng trước</option></select>
                    </div>
                    <div className="chart-area-simulated">
                        {chartData.map((d, i) => {
                            const heightPct = (d.value / maxVal) * 100;
                            return (
                                <div key={i} className="chart-bar-container">
                                    <div className="chart-bar-value">{d.value}</div>
                                    <div className="chart-bar-pill" style={{ height: `${heightPct}%` }}></div>
                                    <div className="chart-bar-label">{d.day}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. THÔNG TIN KHUYẾN MÃI (Promo List) */}
                <section className="promo-info-section modern-card">
                    <div className="card-header">
                        <h2><Ticket size={20}/> Chương trình Giảm giá Đang chạy</h2>
                    </div>
                    <div className="promo-list-dash">
                        {currentPromos.map(p => (
                            <div key={p.id} className="promo-list-item-modern">
                                <div className="promo-icon-modern bg-emerald">🎁</div>
                                <div className="promo-info-modern">
                                    <p className="promo-name-dash">{p.name}</p>
                                    <p className="promo-sub-dash">Hiệu lực: {p.time} | Đã dùng: {p.usage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;