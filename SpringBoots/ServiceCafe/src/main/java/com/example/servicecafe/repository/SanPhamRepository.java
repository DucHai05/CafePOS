package com.example.servicecafe.repository;

import com.example.servicecafe.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SanPhamRepository extends JpaRepository<SanPham, String> {
    Optional<SanPham> findTenSanPhamByMaLoaiSanPham(String maLoaiSanPham);
}
