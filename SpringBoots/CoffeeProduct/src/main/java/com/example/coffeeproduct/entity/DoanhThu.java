package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "DoanhThu")
public class DoanhThu {

    @Id
    @Column(name = "maDoanhThu", length = 20)
    private String maDoanhThu;

    @Column(name = "maCa", length = 20)
    private String maCa;

    @Column(name = "tienMat")
    private double tienMat;

    @Column(name = "tienCK")
    private double tienCK;

    @Column(name = "tienThu")
    private double tienThu;

    @Column(name = "tienChi")
    private double tienChi;

    // --- GETTER VÀ SETTER ---

    public String getMaDoanhThu() {
        return maDoanhThu;
    }

    public void setMaDoanhThu(String maDoanhThu) {
        this.maDoanhThu = maDoanhThu;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public double getTienMat() {
        return tienMat;
    }

    public void setTienMat(double tienMat) {
        this.tienMat = tienMat;
    }

    public double getTienCK() {
        return tienCK;
    }

    public void setTienCK(double tienCK) {
        this.tienCK = tienCK;
    }

    public double getTienThu() {
        return tienThu;
    }

    public void setTienThu(double tienThu) {
        this.tienThu = tienThu;
    }

    public double getTienChi() {
        return tienChi;
    }

    public void setTienChi(double tienChi) {
        this.tienChi = tienChi;
    }
}