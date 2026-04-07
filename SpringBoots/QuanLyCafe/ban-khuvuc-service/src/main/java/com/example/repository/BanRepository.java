package com.example.repository;

import com.example.entity.Ban;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BanRepository extends JpaRepository<Ban, String> {
    // Tên hàm phải là findBy + TênBiếnKhuVuc + TênBiếnMãKhuVuc (viết hoa chữ cái đầu)
    List<Ban> findByKhuVucMaKhuVuc(String maKhuVuc);
}