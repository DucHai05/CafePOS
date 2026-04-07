package com.example.servicecafe.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private String maBan;
    private List<ItemRequest> items;
    private String maCa;

    @Data
    public static class ItemRequest {
        private String maChiTietHD; // <--- THÊM CÁI NÀY: Để React biết ID mà xóa/hủy
        private String maSanPham;
        private String tenSanPham;  // <--- THÊM CÁI NÀY: Để React hiện tên, không bị "Món không xác định"
        private Integer soLuong;
        private Double giaBan;
        private String ghiChu;

        public String getMaChiTietHD() {
            return maChiTietHD;
        }

        public void setMaChiTietHD(String maChiTietHD) {
            this.maChiTietHD = maChiTietHD;
        }

        public String getMaSanPham() {
            return maSanPham;
        }

        public void setMaSanPham(String maSanPham) {
            this.maSanPham = maSanPham;
        }

        public String getTenSanPham() {
            return tenSanPham;
        }

        public void setTenSanPham(String tenSanPham) {
            this.tenSanPham = tenSanPham;
        }

        public Integer getSoLuong() {
            return soLuong;
        }

        public void setSoLuong(Integer soLuong) {
            this.soLuong = soLuong;
        }

        public Double getGiaBan() {
            return giaBan;
        }

        public void setGiaBan(Double giaBan) {
            this.giaBan = giaBan;
        }

        public String getGhiChu() {
            return ghiChu;
        }

        public void setGhiChu(String ghiChu) {
            this.ghiChu = ghiChu;
        }
    }

    public String getMaBan() {
        return maBan;
    }

    public void setMaBan(String maBan) {
        this.maBan = maBan;
    }

    public List<ItemRequest> getItems() {
        return items;
    }

    public void setItems(List<ItemRequest> items) {
        this.items = items;
    }
    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }
}
