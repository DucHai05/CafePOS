package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ChiTietHD")
public class ChiTietHD {

    @Id
    @Column(name = "maChiTietHD", length = 20)
    private String maChiTietHD;

    @Column(name = "maHoaDon", length = 20)
    private String maHoaDon;

    @Column(name = "maSanPham", length = 20)
    private String maSanPham;

    @Column(name = "soLuong")
    private int soLuong;

    @Column(name = "donGia")
    private double donGia;

    @Column(name = "ghiChu", columnDefinition = "nvarchar(100)")
    private String ghiChu;

    // --- GETTER VÀ SETTER ---

    public String getMaChiTietHD() {
        return maChiTietHD;
    }

    public void setMaChiTietHD(String maChiTietHD) {
        this.maChiTietHD = maChiTietHD;
    }

    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public String getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    }

    public int getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(int soLuong) {
        this.soLuong = soLuong;
    }

    public double getDonGia() {
        return donGia;
    }

    public void setDonGia(double donGia) {
        this.donGia = donGia;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
}