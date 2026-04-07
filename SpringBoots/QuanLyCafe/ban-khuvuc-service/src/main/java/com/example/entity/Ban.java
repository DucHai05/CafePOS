package com.example.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ban")
public class Ban {
    @Id
    @Column(name = "maBan", length = 50)
    private String maBan;

    @Column(name = "tenBan", nullable = false)
    private String tenBan;

    @Column(name = "trangThaiBan")
    private String trangThaiBan; // VD: "Trống", "Đang phục vụ", "Bảo trì"

    // Quan hệ N-1 với Khu Vực
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maKhuVuc", nullable = false)
    private KhuVuc khuVuc;

    // Getters and Setters
    public String getMaBan() { return maBan; }
    public void setMaBan(String maBan) { this.maBan = maBan; }
    public String getTenBan() { return tenBan; }
    public void setTenBan(String tenBan) { this.tenBan = tenBan; }
    public String getTrangThaiBan() { return trangThaiBan; }
    public void setTrangThaiBan(String trangThaiBan) { this.trangThaiBan = trangThaiBan; }
    public KhuVuc getKhuVuc() { return khuVuc; }
    public void setKhuVuc(KhuVuc khuVuc) { this.khuVuc = khuVuc; }
}