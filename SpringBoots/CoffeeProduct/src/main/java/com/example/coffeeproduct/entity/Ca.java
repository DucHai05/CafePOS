package com.example.coffeeproduct.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Ca")
public class Ca {

    @Id
    @Column(name = "maCa", length = 20)
    private String maCa;

    @Column(name = "tenCa", columnDefinition = "nvarchar(20)")
    private String tenCa;

    @Column(name = "ngayThang")
    private LocalDateTime ngayThang;

    @Column(name = "trangThai", columnDefinition = "nvarchar(255)")
    private String trangThai;

    @Column(name = "soTienKet")
    private double soTienKet;

    @Column(name = "maNhanVien", length = 20)
    private String maNhanVien;

    // --- GETTER VÀ SETTER ---

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public String getTenCa() {
        return tenCa;
    }

    public void setTenCa(String tenCa) {
        this.tenCa = tenCa;
    }

    public LocalDateTime getNgayThang() {
        return ngayThang;
    }

    public void setNgayThang(LocalDateTime ngayThang) {
        this.ngayThang = ngayThang;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public double getSoTienKet() {
        return soTienKet;
    }

    public void setSoTienKet(double soTienKet) {
        this.soTienKet = soTienKet;
    }

    public String getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(String maNhanVien) {
        this.maNhanVien = maNhanVien;
    }
}