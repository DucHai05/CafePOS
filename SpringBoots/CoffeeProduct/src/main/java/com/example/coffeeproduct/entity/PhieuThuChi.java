package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PhieuThuChi")
public class PhieuThuChi {

    @Id
    @Column(name = "maPhieu", length = 20)
    private String maPhieu;

    @Column(name = "maCa", length = 20)
    private String maCa;

    @Column(name = "soTien")
    private double soTien;

    @Column(name = "ghiChu", columnDefinition = "nvarchar(MAX)")
    private String ghiChu;

    @Column(name = "loaiPhieu", columnDefinition = "nvarchar(20)")
    private String loaiPhieu;

    // --- GETTER VÀ SETTER ---

    public String getMaPhieu() {
        return maPhieu;
    }

    public void setMaPhieu(String maPhieu) {
        this.maPhieu = maPhieu;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public double getSoTien() {
        return soTien;
    }

    public void setSoTien(double soTien) {
        this.soTien = soTien;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public String getLoaiPhieu() {
        return loaiPhieu;
    }

    public void setLoaiPhieu(String loaiPhieu) {
        this.loaiPhieu = loaiPhieu;
    }
}