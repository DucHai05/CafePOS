package com.example.servicecafe.repository;

import com.example.servicecafe.entity.ChiTietHD;
import com.example.servicecafe.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChiTietHDRepository extends JpaRepository<ChiTietHD, String> {

    List<ChiTietHD> findByMaHoaDon(HoaDon maHoaDon);
}
