package com.example.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hoadon")
public class HoaDon {
    @Id
    @Column(name = "maHoaDon", length = 50)
    private String maHoaDon;

    @Column(name = "maBan", length = 50, nullable = false)
    private String maBan;

    @Column(name = "thoiGianVao", nullable = false)
    private LocalDateTime thoiGianVao;

    @Column(name = "thoiGianRa")
    private LocalDateTime thoiGianRa;

    @Column(name = "phuongThucThanhToan")
    private String phuongThucThanhToan;

    @Column(name = "maKhuyenMai", length = 50)
    private String maKhuyenMai;

    @Column(name = "tongTien", precision = 15, scale = 2)
    private BigDecimal tongTien;

    @Column(name = "trangThaiThanhToan", nullable = false)
    private String trangThaiThanhToan;

    @Column(name = "maCa", length = 50, nullable = false)
    private String maCa;

    @Transient
    private String tenBan;

    @Transient
    private LocalDateTime gioRa;

    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public String getMaBan() {
        return maBan;
    }

    public void setMaBan(String maBan) {
        this.maBan = maBan;
    }

    public LocalDateTime getThoiGianVao() {
        return thoiGianVao;
    }

    public void setThoiGianVao(LocalDateTime thoiGianVao) {
        this.thoiGianVao = thoiGianVao;
    }

    public LocalDateTime getThoiGianRa() {
        return thoiGianRa;
    }

    public void setThoiGianRa(LocalDateTime thoiGianRa) {
        this.thoiGianRa = thoiGianRa;
    }

    public String getPhuongThucThanhToan() {
        return phuongThucThanhToan;
    }

    public void setPhuongThucThanhToan(String phuongThucThanhToan) {
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public String getMaKhuyenMai() {
        return maKhuyenMai;
    }

    public void setMaKhuyenMai(String maKhuyenMai) {
        this.maKhuyenMai = maKhuyenMai;
    }

    public BigDecimal getTongTien() {
        return tongTien;
    }

    public void setTongTien(BigDecimal tongTien) {
        this.tongTien = tongTien;
    }

    public String getTrangThaiThanhToan() {
        return trangThaiThanhToan;
    }

    public void setTrangThaiThanhToan(String trangThaiThanhToan) {
        this.trangThaiThanhToan = trangThaiThanhToan;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public String getTenBan() {
        return tenBan;
    }

    public void setTenBan(String tenBan) {
        this.tenBan = tenBan;
    }

    public LocalDateTime getGioRa() {
        return thoiGianRa;
    }

    public void setGioRa(LocalDateTime gioRa) {
        this.gioRa = gioRa;
        this.thoiGianRa = gioRa;
    }
}
