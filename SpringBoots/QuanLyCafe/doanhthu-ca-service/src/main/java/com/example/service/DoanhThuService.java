package com.example.service;

import com.example.entity.DoanhThu;
import com.example.repository.DoanhThuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoanhThuService {
    @Autowired
    private DoanhThuRepository doanhThuRepository;

    public List<DoanhThu> getAll() {
        return doanhThuRepository.findAll();
    }

    public DoanhThu getById(String maDoanhThu) {
        return doanhThuRepository.findById(maDoanhThu)
                .orElseThrow(() -> new RuntimeException("Khong tim thay doanh thu voi ma: " + maDoanhThu));
    }

    public List<DoanhThu> getByMaCa(String maCa) {
        return doanhThuRepository.findByMaCa(maCa);
    }
}
