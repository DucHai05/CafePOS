package com.example.repository;

import com.example.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
    List<HoaDon> findByMaBan(String maBan);
    List<HoaDon> findByMaCa(String maCa);
}
