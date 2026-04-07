package com.example.servicecafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

// BillResponseDTO.java
@Data
@AllArgsConstructor
public class ThanhToanDTO {
    private String maHoaDon;
    private String maBan;
    private Double tongTien;
    private List<BillItemDTO> items;

    @Data
    @AllArgsConstructor
    public static class BillItemDTO {
        private String tenSanPham;
        private Integer soLuong;
        private Double giaBan;
        private Double thanhTien;
    }

    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public String getMaBan() {
        return maBan;
    }

    public void setMaBan(String maBan) {
        this.maBan = maBan;
    }

    public Double getTongTien() {
        return tongTien;
    }

    public void setTongTien(Double tongTien) {
        this.tongTien = tongTien;
    }

    public List<BillItemDTO> getItems() {
        return items;
    }

    public void setItems(List<BillItemDTO> items) {
        this.items = items;
    }
}
