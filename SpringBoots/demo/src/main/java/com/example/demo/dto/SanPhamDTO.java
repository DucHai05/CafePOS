package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SanPhamDTO {
    @NotBlank(message = "Tên sản phẩm không được để trống bạn êy!")
    private String tenSP;

    private Integer maSP;
    @NotNull(message = "Bạn chưa nhập giá tiền!")
    @Min(value = 0, message = "Giá tiền không được là số âm nha!")
    private Double donGia;

    private String tenLoai;

    public void setTenLoai(String tenLoai) {
        this.tenLoai = tenLoai;
    }

    public String getTenLoai() {
        return tenLoai;
    }

    public void setTenSP(String tenSP) {
        this.tenSP = tenSP;
    }

    public String getTenSP() {
        return tenSP;
    }

    public void setMaSP(Integer maSP) {
        this.maSP = maSP;
    }

    public Integer getMaSP() {
        return maSP;
    }

    public void setDonGia(Double donGia) {
        this.donGia = donGia;
    }

    public Double getDonGia() {
        return donGia;
    }
}
