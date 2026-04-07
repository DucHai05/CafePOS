package com.example.servicecafe.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderUpdateDTO {
    private String maHoaDon;
    private String maBan;
    private List<OrderItemDTO> items;
    private Double tongTien;
}