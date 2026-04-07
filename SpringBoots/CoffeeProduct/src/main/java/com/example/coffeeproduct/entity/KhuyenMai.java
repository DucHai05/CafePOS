package com.example.coffeeproduct.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "KhuyenMai")
public class KhuyenMai {

    @Id
    @Column(name = "maKhuyenMai", length = 20)
    private String maKhuyenMai;

    @Column(name = "tenKhuyenMai", columnDefinition = "nvarchar(20)")
    private String tenKhuyenMai;

    @Column(name = "tyLeKhuyenMai")
    private int tyLeKhuyenMai;

    // --- GETTER VÀ SETTER ---

    public String getMaKhuyenMai() {
        return maKhuyenMai;
    }

    public void setMaKhuyenMai(String maKhuyenMai) {
        this.maKhuyenMai = maKhuyenMai;
    }

    public String getTenKhuyenMai() {
        return tenKhuyenMai;
    }

    public void setTenKhuyenMai(String tenKhuyenMai) {
        this.tenKhuyenMai = tenKhuyenMai;
    }

    public int getTyLeKhuyenMai() {
        return tyLeKhuyenMai;
    }

    public void setTyLeKhuyenMai(int tyLeKhuyenMai) {
        this.tyLeKhuyenMai = tyLeKhuyenMai;
    }
}