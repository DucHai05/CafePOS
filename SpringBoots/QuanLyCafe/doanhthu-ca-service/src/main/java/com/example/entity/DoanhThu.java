package com.example.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "doanhthu")
public class DoanhThu {
    @Id
    @Column(name = "maDoanhThu", length = 50)
    private String maDoanhThu;

    @Column(name = "maCa", length = 50, nullable = false)
    private String maCa;

    @Column(name = "tienMat", precision = 15, scale = 2)
    private BigDecimal tienMat;

    @Column(name = "tienCK", precision = 15, scale = 2)
    private BigDecimal tienCK;

    @Column(name = "tienThu", precision = 15, scale = 2)
    private BigDecimal tienThu;

    @Column(name = "tienChi", precision = 15, scale = 2)
    private BigDecimal tienChi;

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

    public BigDecimal getTienMat() {
        return tienMat;
    }

    public void setTienMat(BigDecimal tienMat) {
        this.tienMat = tienMat;
    }

    public BigDecimal getTienCK() {
        return tienCK;
    }

    public void setTienCK(BigDecimal tienCK) {
        this.tienCK = tienCK;
    }

    public BigDecimal getTienThu() {
        return tienThu;
    }

    public void setTienThu(BigDecimal tienThu) {
        this.tienThu = tienThu;
    }

    public BigDecimal getTienChi() {
        return tienChi;
    }

    public void setTienChi(BigDecimal tienChi) {
        this.tienChi = tienChi;
    }
}
