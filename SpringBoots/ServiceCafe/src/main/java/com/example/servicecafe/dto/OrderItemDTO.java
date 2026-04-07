package com.example.servicecafe.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private String maSanPham;
    private Integer soLuong;
    private Double giaBan;
    private String ghiChu;
}