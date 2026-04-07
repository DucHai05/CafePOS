package com.example.coffeeproduct.repository;

import com.example.coffeeproduct.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, String> {
}
