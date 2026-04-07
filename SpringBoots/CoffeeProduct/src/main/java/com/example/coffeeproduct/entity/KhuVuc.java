package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "KhuVuc")
public class KhuVuc {

    @Id
    @Column(name = "maKhuVuc", length = 20)
    private String maKhuVuc;

    @Column(name = "tenKhuVuc", columnDefinition = "nvarchar(20)")
    private String tenKhuVuc;

    @Column(name = "trangThai", columnDefinition = "nvarchar(20)")
    private String trangThai;


    public String getMaKhuVuc() {
        return maKhuVuc;
    }

    public void setMaKhuVuc(String maKhuVuc) {
        this.maKhuVuc = maKhuVuc;
    }

    public String getTenKhuVuc() {
        return tenKhuVuc;
    }

    public void setTenKhuVuc(String tenKhuVuc) {
        this.tenKhuVuc = tenKhuVuc;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }
}