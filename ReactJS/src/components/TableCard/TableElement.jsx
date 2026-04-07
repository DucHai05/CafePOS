const TableManager = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
    <section>
      <h3>Quản lý Khu Vực</h3>
      <KhuVucManager />
    </section>
    
    <section>
      <h3>Quản lý Bàn</h3>
      <BanPage />
    </section>
  </div>
);