package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "NguyenLieu")
public class NguyenLieu {

    @Id
    @Column(name = "maNguyenLieu", length = 20)
    private String maNguyenLieu;

    @Column(name = "tenNguyenLieu", columnDefinition = "nvarchar(100)")
    private String tenNguyenLieu;

    @Column(name = "soLuong")
    private double soLuong;

    @Column(name = "donViTinh", columnDefinition = "nvarchar(20)")
    private String donViTinh;

    // --- GETTER VÀ SETTER ---

    public String getMaNguyenLieu() {
        return maNguyenLieu;
    }

    public void setMaNguyenLieu(String maNguyenLieu) {
        this.maNguyenLieu = maNguyenLieu;
    }

    public String getTenNguyenLieu() {
        return tenNguyenLieu;
    }

    public void setTenNguyenLieu(String tenNguyenLieu) {
        this.tenNguyenLieu = tenNguyenLieu;
    }

    public double getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(double soLuong) {
        this.soLuong = soLuong;
    }

    public String getDonViTinh() {
        return donViTinh;
    }

    public void setDonViTinh(String donViTinh) {
        this.donViTinh = donViTinh;
    }
}