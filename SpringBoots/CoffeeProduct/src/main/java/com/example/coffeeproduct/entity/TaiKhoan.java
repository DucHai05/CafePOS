package com.example.coffeeproduct.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.*;

@Entity
@Table(name = "TaiKhoan")
public class TaiKhoan {

    @Id
    @Column(name = "maTaiKhoan")
    private String maTaiKhoan;

    @Column(name = "maNhanVien")
    private String maNhanVien;

    @Column(name = "tenDangNhap")
    private String tenDangNhap;

    @Column (name = "matKhau")
    private String matKhau;

    @Column (name = "loaiTaiKhoan")
    private String loaiTaiKhoan;

    @Column (name = "OTP")
    private String OTP;

    @Column (name = "email")
    private String email;

    public String getOTP() {
        return OTP;
    }

    public String getLoaiTaiKhoan() {
        return loaiTaiKhoan;
    }

    public String getMaNhanVien() {
        return maNhanVien;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setLoaiTaiKhoan(String loaiTaiKhoan) {
        this.loaiTaiKhoan = loaiTaiKhoan;
    }

    public void setMaNhanVien(String maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public void setMaTaiKhoan(String maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public void setOTP(String OTP) {
        this.OTP = OTP;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
