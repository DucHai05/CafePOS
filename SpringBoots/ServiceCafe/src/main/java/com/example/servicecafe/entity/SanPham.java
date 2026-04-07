package com.example.servicecafe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "SanPham")
public class SanPham {

    @Id
    @Column(name = "maSanPham", length = 20)
    private String maSanPham;

    @Column(name = "tenSanPham", columnDefinition = "nvarchar(100)")
    private String tenSanPham;

    @Column(name = "donGia")
    private double donGia;

    @Column(name = "duongDanHinh", columnDefinition = "text")
    private String duongDanHinh;

    @Column(name = "maLoaiSanPham", length = 20)
    private String maLoaiSanPham;

    @Column(name = "trangThai", columnDefinition = "nvarchar(20)")
    private String trangThai;


    public String getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    }

    public String getTenSanPham() {
        return tenSanPham;
    }

    public void setTenSanPham(String tenSanPham) {
        this.tenSanPham = tenSanPham;
    }

    public double getDonGia() {
        return donGia;
    }

    public void setDonGia(double donGia) {
        this.donGia = donGia;
    }

    public String getDuongDanHinh() {
        return duongDanHinh;
    }

    public void setDuongDanHinh(String duongDanHinh) {
        this.duongDanHinh = duongDanHinh;
    }

    public String getMaLoaiSanPham() {
        return maLoaiSanPham;
    }

    public void setMaLoaiSanPham(String maLoaiSanPham) {
        this.maLoaiSanPham = maLoaiSanPham;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }
}