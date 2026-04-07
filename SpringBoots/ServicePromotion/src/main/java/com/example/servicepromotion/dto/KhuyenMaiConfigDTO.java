package com.example.servicepromotion.dto;


import lombok.Data;

@Data
public class KhuyenMaiConfigDTO {
    private String loaiDoiTuong;      // ALL hoặc SELECTIVE
    private double giaTriDonToiThieu;
    private String ap_dung_cho_mon;
}