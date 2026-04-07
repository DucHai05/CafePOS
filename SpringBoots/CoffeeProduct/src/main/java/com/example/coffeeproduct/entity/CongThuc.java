package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CongThuc")
@IdClass(CongThucId.class) // Khai báo sử dụng khóa hỗn hợp
public class CongThuc {

    @Id
    @Column(name = "maSanPham", length = 20)
    private String maSanPham;

    @Id
    @Column(name = "maNguyenLieu", length = 20)
    private String maNguyenLieu;

    @Column(name = "soLuong")
    private double soLuong;

    // --- GETTER VÀ SETTER ---

    public String getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    }

    public String getMaNguyenLieu() {
        return maNguyenLieu;
    }

    public void setMaNguyenLieu(String maNguyenLieu) {
        this.maNguyenLieu = maNguyenLieu;
    }

    public double getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(double soLuong) {
        this.soLuong = soLuong;
    }
}