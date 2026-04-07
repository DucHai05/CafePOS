package com.example.repository;

import com.example.entity.ChiTietHD;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChiTietHDRepository extends JpaRepository<ChiTietHD, String> {
    List<ChiTietHD> findByMaHoaDon(String maHoaDon);
}
