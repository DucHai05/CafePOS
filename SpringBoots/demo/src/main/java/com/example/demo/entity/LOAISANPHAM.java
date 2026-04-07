package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "LOAISANPHAM")
public class LOAISANPHAM {

    @Id
    @Column(name = "MaLoai")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maLoai;

    @Column(name = "TenLoai")
    private String tenLoai;

    public Integer getMaLoai() {
        return maLoai;
    }

    public String getTenLoai() {
        return tenLoai;
    }

    public void setMaLoai(Integer maLoai) {
        this.maLoai = maLoai;
    }

    public void setTenLoai(String tenLoai) {
        this.tenLoai = tenLoai;
    }
}