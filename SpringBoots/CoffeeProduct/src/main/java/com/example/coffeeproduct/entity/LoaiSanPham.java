package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "LoaiSanPham")
public class LoaiSanPham {

    @Id
    @Column(name = "maLoaiSanPham", length = 20)
    private String maLoaiSanPham;

    @Column(name = "tenLoaiSanPham", columnDefinition = "nvarchar(100)")
    private String tenLoaiSanPham;

    @Column(name = "duongDanHinh", columnDefinition = "text")
    private String duongDanHinh;

    // --- GETTER VÀ SETTER ---

    public String getMaLoaiSanPham() {
        return maLoaiSanPham;
    }

    public void setMaLoaiSanPham(String maLoaiSanPham) {
        this.maLoaiSanPham = maLoaiSanPham;
    }

    public String getTenLoaiSanPham() {
        return tenLoaiSanPham;
    }

    public void setTenLoaiSanPham(String tenLoaiSanPham) {
        this.tenLoaiSanPham = tenLoaiSanPham;
    }

    public String getDuongDanHinh() {
        return duongDanHinh;
    }

    public void setDuongDanHinh(String duongDanHinh) {
        this.duongDanHinh = duongDanHinh;
    }
}