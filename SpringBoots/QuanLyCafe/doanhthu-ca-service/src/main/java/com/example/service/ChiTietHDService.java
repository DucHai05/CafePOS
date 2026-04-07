package com.example.service;

import com.example.entity.ChiTietHD;
import com.example.repository.ChiTietHDRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietHDService {
    @Autowired
    private ChiTietHDRepository chiTietHDRepository;

    public List<ChiTietHD> getAll() {
        return chiTietHDRepository.findAll();
    }

    public ChiTietHD getById(String maChiTietHD) {
        return chiTietHDRepository.findById(maChiTietHD)
                .orElseThrow(() -> new RuntimeException("Khong tim thay chi tiet hoa don voi ma: " + maChiTietHD));
    }

    public List<ChiTietHD> getByMaHoaDon(String maHoaDon) {
        return chiTietHDRepository.findByMaHoaDon(maHoaDon);
    }
}
