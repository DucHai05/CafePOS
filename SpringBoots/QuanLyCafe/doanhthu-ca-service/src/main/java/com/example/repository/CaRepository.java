package com.example.repository;

import com.example.entity.Ca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CaRepository extends JpaRepository<Ca, String> {
    List<Ca> findByNgayThang(LocalDate ngayThang);
    List<Ca> findByMaNhanVien(String maNhanVien);
    Optional<Ca> findFirstByTrangThaiOrderByNgayThangDescGioMoCaDesc(String trangThai);
    Optional<Ca> findTopByOrderByMaCaDesc();
}