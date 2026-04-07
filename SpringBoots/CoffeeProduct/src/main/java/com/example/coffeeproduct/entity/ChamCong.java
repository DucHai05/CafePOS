package com.example.coffeeproduct.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ChamCong")
public class ChamCong {

    @Id
    @Column(name = "maChamCong", length = 20)
    private String maChamCong;

    @Column(name = "maNhanVien", length = 20)
    private String maNhanVien;

    @Column(name = "maCa", length = 20)
    private String maCa;

    @Column(name = "thoiGianVao")
    private LocalDateTime thoiGianVao;

    @Column(name = "thoiGianRa")
    private LocalDateTime thoiGianRa;

    @Column(name = "soGioLam")
    private int soGioLam;

    @Column(name = "trangThai")
    private String trangThai;



    public String getMaChamCong() {
        return maChamCong;
    }

    public void setMaChamCong(String maChamCong) {
        this.maChamCong = maChamCong;
    }

    public String getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(String maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
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

    public int getSoGioLam() {
        return soGioLam;
    }

    public void setSoGioLam(int soGioLam) {
        this.soGioLam = soGioLam;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }
}