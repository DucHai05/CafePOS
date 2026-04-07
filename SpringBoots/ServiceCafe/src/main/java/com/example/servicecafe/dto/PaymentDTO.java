package com.example.servicecafe.dto;

import lombok.Data;

import java.util.List;

// PaymentDTO.java
@Data
public class PaymentDTO {
    private String maHoaDon;

    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    private String maBan;
    private List<ItemDTO> items;
    private String phuongThucThanhToan;
    private String maKhuyenMai;
    private Double tongTienSauKM;
    private String thoiGianThanhToan;
    private String trangThaiThanhToan;

    @Data
    public static class ItemDTO {
        private String maSanPham;
        private Integer soLuong;
        private Double giaBan;
    }

    public String getMaBan() {
        return maBan;
    }

    public void setMaBan(String maBan) {
        this.maBan = maBan;
    }

    public List<ItemDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemDTO> items) {
        this.items = items;
    }

    public String getPhuongThucThanhToan() {
        return phuongThucThanhToan;
    }

    public void setPhuongThucThanhToan(String phuongThucThanhToan) {
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public String getMaKhuyenMai() {
        return maKhuyenMai;
    }

    public void setMaKhuyenMai(String maKhuyenMai) {
        this.maKhuyenMai = maKhuyenMai;
    }

    public Double getTongTienSauKM() {
        return tongTienSauKM;
    }

    public void setTongTienSauKM(Double tongTienSauKM) {
        this.tongTienSauKM = tongTienSauKM;
    }

    public String getThoiGianThanhToan() {
        return thoiGianThanhToan;
    }

    public void setThoiGianThanhToan(String thoiGianThanhToan) {
        this.thoiGianThanhToan = thoiGianThanhToan;
    }

    public String getTrangThaiThanhToan() {
        return trangThaiThanhToan;
    }

    public void setTrangThaiThanhToan(String trangThaiThanhToan) {
        this.trangThaiThanhToan = trangThaiThanhToan;
    }
}