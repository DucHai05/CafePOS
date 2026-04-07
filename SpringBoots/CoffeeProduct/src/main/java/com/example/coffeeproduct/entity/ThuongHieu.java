package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ThuongHieu")
public class ThuongHieu {

    @Id
    @Column(name = "maThuongHieu")
    private String maThuongHieu;

    @Column(name = "tenThuongHieu", columnDefinition = "nvarchar(255)")
    private String tenThuongHieu;

    @Column(name = "diaChi", columnDefinition = "nvarchar(500)")
    private String diaChi;

    public String getMaThuongHieu() {
        return maThuongHieu;
    }

    public void setMaThuongHieu(String maThuongHieu) {
        this.maThuongHieu = maThuongHieu;
    }

    public String getTenThuongHieu() {
        return tenThuongHieu;
    }

    public void setTenThuongHieu(String tenThuongHieu) {
        this.tenThuongHieu = tenThuongHieu;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }
}
