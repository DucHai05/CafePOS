package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Ban")
public class Ban {

    @Id
    @Column(name = "maBan", length = 20)
    private String maBan;

    @Column(name = "maKhuVuc", length = 20)
    private String maKhuVuc;

    @Column(name = "trangThaiBan", columnDefinition = "nvarchar(20)")
    private String trangThaiBan;

    @Column(name = "tenBan", columnDefinition = "nvarchar(20)")
    private String tenBan;

    // --- GETTER VÀ SETTER ---

    public String getMaBan() {
        return maBan;
    }

    public void setMaBan(String maBan) {
        this.maBan = maBan;
    }

    public String getMaKhuVuc() {
        return maKhuVuc;
    }

    public void setMaKhuVuc(String maKhuVuc) {
        this.maKhuVuc = maKhuVuc;
    }

    public String getTrangThaiBan() {
        return trangThaiBan;
    }

    public void setTrangThaiBan(String trangThaiBan) {
        this.trangThaiBan = trangThaiBan;
    }

    public String getTenBan() {
        return tenBan;
    }

    public void setTenBan(String tenBan) {
        this.tenBan = tenBan;
    }
}