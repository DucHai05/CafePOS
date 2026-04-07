import React from 'react';

const PromoTypeTable = ({ data, onEdit, onDelete }) => {
  return (
    <table className="promo-table">
      <thead>
        <tr>
          <th>Đối tượng</th>
          <th>Mức giảm</th>
          <th>Mô tả</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data.map(t => (
          <tr key={t.maKhuyenMai}>
            <td><strong>{t.tenKhuyenMai}</strong></td>
            <td>
              <span className="percent-tag">
                -{t.giaTri.toLocaleString()}{t.loaiKhuyenMai === 'PERCENT' ? '%' : 'đ'}
              </span>
            </td>
            <td>{t.moTa}</td>
            <td>{t.trangThai ? 'Đang bật' : 'Đã tắt'}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(t)}>Sửa</button>
              <button className="del-btn-table" onClick={() => onDelete(t.maKhuyenMai)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PromoTypeTable;