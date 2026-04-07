package com.example.coffeeproduct.entity;

import java.io.Serializable;
import java.util.Objects;

public class CongThucId implements Serializable {
    private String maSanPham;
    private String maNguyenLieu;

    // Constructor mặc định
    public CongThucId() {}

    public CongThucId(String maSanPham, String maNguyenLieu) {
        this.maSanPham = maSanPham;
        this.maNguyenLieu = maNguyenLieu;
    }

    // Phải ghi đè equals và hashCode để JPA so sánh được khóa
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CongThucId that = (CongThucId) o;
        return Objects.equals(maSanPham, that.maSanPham) &&
                Objects.equals(maNguyenLieu, that.maNguyenLieu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maSanPham, maNguyenLieu);
    }
}