package com.example.repository;

import com.example.entity.DoanhThu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoanhThuRepository extends JpaRepository<DoanhThu, String> {
    List<DoanhThu> findByMaCa(String maCa);
    Optional<DoanhThu> findFirstByMaCa(String maCa);
    Optional<DoanhThu> findTopByOrderByMaDoanhThuDesc();
}