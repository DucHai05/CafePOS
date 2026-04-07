package com.example.demo.entity; // Tên package trong Java thường viết thường toàn bộ

import jakarta.persistence.*;

@Entity
@Table(name = "SANPHAM") // Tên bảng trong SQL Server
public class SANPHAM {

    @Id
    @Column(name = "MaSP")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maSP;

    @Column (name = "TenSP")
    private String tenSP;

    @Column (name = "DonGia")
    private Double donGia;

    @ManyToOne
    @JoinColumn (name = "MaLoai")
    private LOAISANPHAM maLoai;

    @Column (name = "TrangThai")
    private Integer trangThai;

    public Integer getMaSP() {
        return maSP;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public Double getDonGia() {
        return donGia;
    }

    public String getTenSP() {
        return tenSP;
    }

    public LOAISANPHAM getMaLoai() { return maLoai; }

    public void setDonGia(Double donGia) {
        this.donGia = donGia;
    }

    public void setMaSP(Integer maSP) {
        this.maSP = maSP;
    }

    public void setTenSP(String tenSP) {
        this.tenSP = tenSP;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public void setMaLoai(LOAISANPHAM maLoai) { this.maLoai = maLoai; }

}
