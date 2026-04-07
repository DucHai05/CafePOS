package com.example.coffeeproduct.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "NhanVien")
public class NhanVien {

    @Id
    @Column(name = "maNhanVien", length = 20)
    private String maNhanVien;

    @Column(name = "tenNhanVien", columnDefinition = "nvarchar(100)")
    private String tenNhanVien;

    @Column(name = "chucVu", columnDefinition = "nvarchar(50)")
    private String chucVu;

    @Column(name = "maThuongHieu", length = 20)
    private String maThuongHieu;

    @Column(name = "tienLuong")
    private double tienLuong;

    @Column(name = "ngayVaoLam")
    private LocalDateTime ngayVaoLam;

    @Column(name = "ngaySinh")
    private LocalDateTime ngaySinh;


    public String getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(String maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public String getTenNhanVien() {
        return tenNhanVien;
    }

    public void setTenNhanVien(String tenNhanVien) {
        this.tenNhanVien = tenNhanVien;
    }

    public String getChucVu() {
        return chucVu;
    }

    public void setChucVu(String chucVu) {
        this.chucVu = chucVu;
    }

    public String getMaThuongHieu() {
        return maThuongHieu;
    }

    public void setMaThuongHieu(String maThuongHieu) {
        this.maThuongHieu = maThuongHieu;
    }

    public double getTienLuong() {
        return tienLuong;
    }

    public void setTienLuong(double tienLuong) {
        this.tienLuong = tienLuong;
    }

    public LocalDateTime getNgayVaoLam() {
        return ngayVaoLam;
    }

    public void setNgayVaoLam(LocalDateTime ngayVaoLam) {
        this.ngayVaoLam = ngayVaoLam;
    }

    public LocalDateTime getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(LocalDateTime ngaySinh) {
        this.ngaySinh = ngaySinh;
    }
}